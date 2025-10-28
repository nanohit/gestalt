'use client';

import { createElement, useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, Ref } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { createEmptyDay, createEmptyPricingOption, createEmptySession, createEmptySpeaker } from "@/app/lib/content";
import { useSiteContent } from "@/app/hooks/useSiteContent";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "dea282c8a3ed6b4d82eed4ea65ab3826";

type EditableTextProps = {
  tag?: keyof React.JSX.IntrinsicElements;
  value: string;
  canEdit: boolean;
  className?: string;
  onChange: (value: string) => void;
};

function EditableText({
  tag = "span",
  value,
  canEdit,
  className,
  onChange,
}: EditableTextProps) {
  const Tag = tag;
  const [isEditing, setIsEditing] = useState(false);
  const [initialValue, setInitialValue] = useState(value);
  const elementRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef(false);
  const isEditingRef = useRef(isEditing);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && elementRef.current) {
      if (elementRef.current.innerText !== value) {
        elementRef.current.innerText = value;
      }
      setInitialValue(value);
    }
  }, [isEditing, value]);

  const enableEditing = useCallback(() => {
    if (!canEdit) return;
    setInitialValue(value);
    setIsEditing(true);
    cancelRef.current = false;
    requestAnimationFrame(() => {
      const element = elementRef.current;
      if (element) {
        element.focus({ preventScroll: true });
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });
  }, [canEdit, value]);

  const commitChanges = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    const nextValue = element.innerText.trim();
    onChange(nextValue);
    setIsEditing(false);
  }, [onChange]);

  const cancelChanges = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      element.innerText = initialValue;
    }
    cancelRef.current = true;
    setIsEditing(false);
  }, [initialValue]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!isEditing) return;
      if (event.key === "Enter") {
        event.preventDefault();
        commitChanges();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        cancelChanges();
      }
    },
    [cancelChanges, commitChanges, isEditing],
  );

  const handleBlur = useCallback(() => {
    if (!isEditingRef.current) {
      cancelRef.current = false;
      return;
    }
    if (cancelRef.current) {
      cancelRef.current = false;
      return;
    }
    commitChanges();
  }, [commitChanges]);

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      elementRef.current = element;
    },
    [value],
  );

  return createElement(
    tag ?? "span",
    {
      ref: refCallback as unknown as Ref<any>,
      className: `${className ?? ""} ${canEdit ? styles.editable : ""} ${
        isEditing ? styles.editing : ""
      }`,
      contentEditable: isEditing,
      suppressContentEditableWarning: true,
      onClick: enableEditing,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      role: canEdit ? "textbox" : undefined,
      "aria-label": canEdit ? "Редактируемый текст" : undefined,
      tabIndex: canEdit ? 0 : undefined,
    },
    value,
  );
}

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { content, status, error, setContentState, reload } = useSiteContent(isAdmin);
  const {
    programDays,
    speakers: speakerItems,
    pricingOptions,
    registrationNotifications,
    contactSection,
  } = content;

  const cleanedPhone = contactSection.phone.replace(/[^\d+]/g, "");
  const phoneHref = cleanedPhone ? `tel:${cleanedPhone}` : undefined;
  const emailHref = contactSection.email ? `mailto:${contactSection.email}` : undefined;
  const websiteHref = contactSection.website
    ? contactSection.website.startsWith("http://") || contactSection.website.startsWith("https://")
      ? contactSection.website
      : `https://${contactSection.website}`
    : undefined;

  const scrollToElement = (element: HTMLElement | null) => {
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToProgram = () => {
    const section = document.getElementById("program");
    scrollToElement(section);
  };

  const handleScrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    scrollToElement(section);
  };

  const handleOpenLogin = useCallback(() => {
    setLogin("admin");
    setPassword("");
    setLoginError("");
    setIsLoginModalOpen(true);
  }, []);

  const handleCloseLogin = useCallback(() => {
    setIsLoginModalOpen(false);
    setPassword("");
    setLoginError("");
  }, []);

  const handleLoginSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (login === "admin" && password === "123456789") {
        setIsAdmin(true);
        setIsLoginModalOpen(false);
        setPassword("");
        setLoginError("");
      } else {
        setLoginError("Неверный логин или пароль");
      }
    },
    [login, password],
  );

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logo1.png"
              alt="Логотип 1"
              width={120}
              height={60}
              className={styles.logoImage}
              priority
            />
            <Image
              src="/logo2.png"
              alt="Логотип 2"
              width={120}
              height={66}
              className={styles.logoImage}
              priority
            />
          </div>
          <nav className={styles.nav}>
            <button type="button" onClick={handleScrollToProgram}>
              Программа
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection("speakers")}
            >
              Спикеры
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection("pricing")}
            >
              Стоимость
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection("registration")}
            >
              Регистрация
            </button>
          </nav>
        </div>
      </header>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.mobileLogos}>
            <Image
              src="/logo1.png"
              alt="Логотип 1"
              width={120}
              height={60}
              className={styles.logoImageMobile}
              priority
            />
            <Image
              src="/logo2.png"
              alt="Логотип 2"
              width={120}
              height={66}
              className={styles.logoImageMobile}
              priority
            />
          </div>
          <div className={styles.heroInner}>
            <div>
              <p className={styles.heroConferenceLabel}>Конференция</p>
              <h1 className={styles.heroHeading}>
                Актуальные вопросы
                <br />
                гештальт-терапии
              </h1>
              <p className={styles.heroSubheadingMatch}>
                Терапевтическая практика.
                <br />
                Современные реалии.
              </p>
            </div>
            <div className={styles.heroActions}>
              <button type="button" className={styles.heroButtonPrimary} onClick={() => handleScrollToSection("registration")}>
                Зарегистрироваться
              </button>
              <button type="button" className={styles.heroButtonSecondary} onClick={handleScrollToProgram}>
                Программа
              </button>
            </div>
            <div className={styles.heroDetails}>
              <div className={styles.heroDetail}>
                <span className={styles.heroDetailLabel}>Дата</span>
                <span className={styles.heroDetailValue}>
                  24, 25, 26 ноября 2025
                </span>
              </div>
              <div className={styles.heroDetail}>
                <span className={styles.heroDetailLabel}>Время</span>
                <span className={styles.heroDetailValue}>10:00 - 14:00 МСК</span>
              </div>
              <div className={styles.heroDetail}>
                <span className={styles.heroDetailLabel}>Формат</span>
                <span className={styles.heroDetailValue}>Онлайн</span>
              </div>
            </div>
          </div>
          <div className={styles.heroArrow}>
            <button
              type="button"
              className={styles.heroArrowButton}
              onClick={handleScrollToProgram}
              aria-label="Прокрутить к программе конференции"
            >
              <span className={styles.heroArrowIcon} />
            </button>
          </div>
        </section>

        <section id="program" className={styles.section}>
          <h2 className={styles.sectionHeading}>Программа конференции</h2>
          <div className={styles.programGrid}>
            {programDays.map((day, dayIndex) => (
              <div key={`${day.date}-${dayIndex}`} className={styles.programColumn}>
                <EditableText
                  tag="div"
                  value={day.date}
                  canEdit={isAdmin}
                  className={styles.programColumnHeader}
                  onChange={(nextValue) =>
                    setContentState((prev) => {
                      const next = { ...prev };
                      next.programDays = prev.programDays.map((item, index) =>
                        index === dayIndex ? { ...item, date: nextValue } : item,
                      );
                      return next;
                    })
                  }
                />
                <div className={styles.programColumnBody}>
                  {day.sessions.map((session, sessionIndex) => (
                    <div key={`${day.date}-${sessionIndex}`} className={styles.sessionCard}>
                      <div className={styles.sessionMeta}>
                        <EditableText
                          tag="span"
                          value={session.time}
                          canEdit={isAdmin}
                          className={styles.sessionTime}
                          onChange={(nextValue) =>
                            setContentState((prev) => {
                              const next = { ...prev };
                              next.programDays = prev.programDays.map((item, index) => {
                                if (index !== dayIndex) return item;
                                const sessions = item.sessions.map((s, idx) =>
                                  idx === sessionIndex ? { ...s, time: nextValue } : s,
                                );
                                return { ...item, sessions };
                              });
                              return next;
                            })
                          }
                        />
                        <EditableText
                          tag="span"
                          value={session.type}
                          canEdit={isAdmin}
                          className={styles.sessionType}
                          onChange={(nextValue) =>
                            setContentState((prev) => {
                              const next = { ...prev };
                              next.programDays = prev.programDays.map((item, index) => {
                                if (index !== dayIndex) return item;
                                const sessions = item.sessions.map((s, idx) =>
                                  idx === sessionIndex ? { ...s, type: nextValue } : s,
                                );
                                return { ...item, sessions };
                              });
                              return next;
                            })
                          }
                        />
                      </div>
                      <EditableText
                        tag="div"
                        value={session.title}
                        canEdit={isAdmin}
                        className={styles.sessionTitle}
                        onChange={(nextValue) =>
                          setContentState((prev) => {
                            const next = { ...prev };
                            next.programDays = prev.programDays.map((item, index) => {
                              if (index !== dayIndex) return item;
                              const sessions = item.sessions.map((s, idx) =>
                                idx === sessionIndex ? { ...s, title: nextValue } : s,
                              );
                              return { ...item, sessions };
                            });
                            return next;
                          })
                        }
                      />
                      <EditableText
                        tag="div"
                        value={session.description}
                        canEdit={isAdmin}
                        className={styles.sessionDescription}
                        onChange={(nextValue) =>
                          setContentState((prev) => {
                            const next = { ...prev };
                            next.programDays = prev.programDays.map((item, index) => {
                              if (index !== dayIndex) return item;
                              const sessions = item.sessions.map((s, idx) =>
                                idx === sessionIndex ? { ...s, description: nextValue } : s,
                              );
                              return { ...item, sessions };
                            });
                            return next;
                          })
                        }
                      />
                      {isAdmin && (
                        <div className={styles.inlineControls}>
                          <button
                            type="button"
                            className={styles.controlButton}
                            onClick={() =>
                              setContentState((prev) => {
                                const next = { ...prev };
                                next.programDays = prev.programDays.map((item, index) => {
                                  if (index !== dayIndex) return item;
                                  const sessions = item.sessions.filter((_, idx) => idx !== sessionIndex);
                                  return { ...item, sessions: sessions.length ? sessions : [createEmptySession()] };
                                });
                                return next;
                              })
                            }
                            aria-label="Удалить сессию"
                          >
                            −
                          </button>
                      </div>
                      )}
                    </div>
                  ))}
                  {isAdmin && (
                    <button
                      type="button"
                      className={`${styles.controlButton} ${styles.addButton}`}
                      onClick={() =>
                        setContentState((prev) => {
                          const next = { ...prev };
                          next.programDays = prev.programDays.map((item, index) =>
                            index === dayIndex
                              ? { ...item, sessions: [...item.sessions, createEmptySession()] }
                              : item,
                          );
                          return next;
                        })
                      }
                      aria-label="Добавить сессию"
                    >
                      + Добавить сессию
                    </button>
                  )}
                </div>
                {isAdmin && (
                  <div className={styles.columnControls}>
                    <button
                      type="button"
                      className={`${styles.controlButton} ${styles.addButton}`}
                      onClick={() =>
                        setContentState((prev) => {
                          const nextDays = [...prev.programDays];
                          nextDays.splice(dayIndex + 1, 0, createEmptyDay());
                          return { ...prev, programDays: nextDays };
                        })
                      }
                      aria-label="Добавить день"
                    >
                      + День
                    </button>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() =>
                        setContentState((prev) => {
                          const nextDays = prev.programDays.length === 1
                            ? [createEmptyDay()]
                            : prev.programDays.filter((_, idx) => idx !== dayIndex);
                          return { ...prev, programDays: nextDays };
                        })
                      }
                      aria-label="Удалить день"
                    >
                      − День
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && programDays.length === 0 && (
            <div className={styles.emptyState}>Нет данных. Добавьте день программы.</div>
          )}
        </section>

        <section className={styles.section} id="speakers">
          <h2 className={styles.sectionHeading}>Спикеры конференции</h2>
          <div className={styles.speakersGrid}>
            {speakerItems.map((speaker, speakerIndex) => (
              <div key={`${speaker.name}-${speakerIndex}`} className={styles.speakerCard}>
                <div className={styles.speakerPhotoWrapper}>
                  {speaker.photoUrl ? (
                    <Image
                      src={speaker.photoUrl}
                      alt={speaker.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 1fr"
                      className={styles.speakerPhotoImage}
                    />
                  ) : (
                    <div className={styles.speakerPhotoPlaceholder}>Фото</div>
                  )}
                  {isAdmin && (
                    <label className={styles.speakerPhotoUpload}>
                      Заменить фото
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append("image", file);
                          try {
                            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                              method: "POST",
                              body: formData,
                            });
                            const payload = (await response.json()) as {
                              success: boolean;
                              data?: { url: string };
                              error?: { message: string };
                            };
                            if (!payload.success || !payload.data?.url) {
                              throw new Error(payload.error?.message || "Не удалось загрузить изображение");
                            }
                            setContentState((prev) => {
                              const speakers = prev.speakers.map((item, index) =>
                                index === speakerIndex ? { ...item, photoUrl: payload.data!.url } : item,
                              );
                              return { ...prev, speakers };
                            });
                          } catch (err) {
                            console.error("Failed to upload speaker photo", err);
                            alert(
                              err instanceof Error
                                ? err.message
                                : "Не удалось загрузить изображение. Попробуйте позже.",
                            );
                          } finally {
                            event.target.value = "";
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <EditableText
                    tag="div"
                    value={speaker.name}
                    canEdit={isAdmin}
                    className={styles.speakerName}
                    onChange={(nextValue) =>
                      setContentState((prev) => {
                        const speakers = prev.speakers.map((item, index) =>
                          index === speakerIndex ? { ...item, name: nextValue } : item,
                        );
                        return { ...prev, speakers };
                      })
                    }
                  />
                  <EditableText
                    tag="div"
                    value={speaker.role}
                    canEdit={isAdmin}
                    className={styles.speakerRole}
                    onChange={(nextValue) =>
                      setContentState((prev) => {
                        const speakers = prev.speakers.map((item, index) =>
                          index === speakerIndex ? { ...item, role: nextValue } : item,
                        );
                        return { ...prev, speakers };
                      })
                    }
                  />
                  <EditableText
                    tag="div"
                    value={speaker.experience}
                    canEdit={isAdmin}
                    className={styles.speakerExperience}
                    onChange={(nextValue) =>
                      setContentState((prev) => {
                        const speakers = prev.speakers.map((item, index) =>
                          index === speakerIndex ? { ...item, experience: nextValue } : item,
                        );
                        return { ...prev, speakers };
                      })
                    }
                  />
                </div>
                <EditableText
                  tag="div"
                  value={speaker.description}
                  canEdit={isAdmin}
                  className={styles.speakerDescription}
                  onChange={(nextValue) =>
                    setContentState((prev) => {
                      const speakers = prev.speakers.map((item, index) =>
                        index === speakerIndex ? { ...item, description: nextValue } : item,
                      );
                      return { ...prev, speakers };
                    })
                  }
                />
                <div className={styles.speakerTags}>
                  {speaker.tags.map((tag, tagIndex) => (
                    <div key={`${tag}-${tagIndex}`} className={styles.tagRow}>
                      <EditableText
                        tag="span"
                        value={tag}
                        canEdit={isAdmin}
                        className={styles.speakerTag}
                        onChange={(nextValue) =>
                          setContentState((prev) => {
                            const speakers = prev.speakers.map((item, index) => {
                              if (index !== speakerIndex) return item;
                              const tags = item.tags.map((t, idx) => (idx === tagIndex ? nextValue : t));
                              return { ...item, tags };
                            });
                            return { ...prev, speakers };
                          })
                        }
                      />
                      {isAdmin && (
                        <button
                          type="button"
                          className={styles.controlButton}
                          onClick={() =>
                            setContentState((prev) => {
                              const speakers = prev.speakers.map((item, index) => {
                                if (index !== speakerIndex) return item;
                                const tags = item.tags.filter((_, idx) => idx !== tagIndex);
                                return { ...item, tags: tags.length ? tags : ["Новый тег"] };
                              });
                              return { ...prev, speakers };
                            })
                          }
                          aria-label="Удалить тег"
                        >
                          −
                        </button>
                      )}
                    </div>
                  ))}
                  {isAdmin && (
                    <button
                      type="button"
                      className={`${styles.controlButton} ${styles.addButton}`}
                      onClick={() =>
                        setContentState((prev) => {
                          const speakers = prev.speakers.map((item, index) =>
                            index === speakerIndex ? { ...item, tags: [...item.tags, "Новый тег"] } : item,
                          );
                          return { ...prev, speakers };
                        })
                      }
                      aria-label="Добавить тег"
                    >
                      + тег
                    </button>
                  )}
                </div>
                {isAdmin && (
                  <div className={styles.inlineControls}>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() =>
                        setContentState((prev) => {
                          const speakers = prev.speakers.length === 1
                            ? [createEmptySpeaker()]
                            : prev.speakers.filter((_, idx) => idx !== speakerIndex);
                          return { ...prev, speakers };
                        })
                      }
                      aria-label="Удалить спикера"
                    >
                      −
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <button
                type="button"
                className={`${styles.controlButton} ${styles.addCardButton}`}
                onClick={() =>
                  setContentState((prev) => ({
                    ...prev,
                    speakers: [...prev.speakers, createEmptySpeaker()],
                  }))
                }
                aria-label="Добавить спикера"
              >
                + Добавить спикера
              </button>
            )}
          </div>
        </section>

        <section className={styles.section} id="pricing">
          <h2 className={styles.sectionHeading}>Стоимость участия</h2>
          <div className={styles.pricingGrid}>
            {pricingOptions.map((option, optionIndex) => (
              <div
                key={`${option.period}-${optionIndex}`}
                className={`${styles.priceCard} ${option.highlight ? styles.highlight : ""}`}
              >
                {(option.label || isAdmin) && (
                  <EditableText
                    tag="span"
                    value={option.label ?? ""}
                    canEdit={isAdmin}
                    className={styles.priceBadge}
                    onChange={(nextValue) =>
                      setContentState((prev) => {
                        const pricingOptions = prev.pricingOptions.map((item, index) =>
                          index === optionIndex ? { ...item, label: nextValue || undefined } : item,
                        );
                        return { ...prev, pricingOptions };
                      })
                    }
                  />
                )}
                <EditableText
                  tag="span"
                  value={option.period}
                  canEdit={isAdmin}
                  className={styles.pricePeriod}
                  onChange={(nextValue) =>
                    setContentState((prev) => {
                      const pricingOptions = prev.pricingOptions.map((item, index) =>
                        index === optionIndex ? { ...item, period: nextValue } : item,
                      );
                      return { ...prev, pricingOptions };
                    })
                  }
                />
                <EditableText
                  tag="span"
                  value={option.price}
                  canEdit={isAdmin}
                  className={styles.priceValue}
                  onChange={(nextValue) =>
                    setContentState((prev) => {
                      const pricingOptions = prev.pricingOptions.map((item, index) =>
                        index === optionIndex ? { ...item, price: nextValue } : item,
                      );
                      return { ...prev, pricingOptions };
                    })
                  }
                />
                <div className={styles.priceFeatures}>
                  {option.features.map((feature, featureIndex) => (
                    <div key={`${feature}-${featureIndex}`} className={styles.featureRow}>
                      <EditableText
                        tag="span"
                        value={`• ${feature}`}
                        canEdit={isAdmin}
                        className={styles.priceFeature}
                        onChange={(nextValue) =>
                          setContentState((prev) => {
                            const pricingOptions = prev.pricingOptions.map((item, index) => {
                              if (index !== optionIndex) return item;
                              const cleaned = nextValue.replace(/^•\s*/, "");
                              const features = item.features.map((f, idx) => (idx === featureIndex ? cleaned : f));
                              return { ...item, features };
                            });
                            return { ...prev, pricingOptions };
                          })
                        }
                      />
                      {isAdmin && (
                        <button
                          type="button"
                          className={styles.controlButton}
                          onClick={() =>
                            setContentState((prev) => {
                              const pricingOptions = prev.pricingOptions.map((item, index) => {
                                if (index !== optionIndex) return item;
                                const features = item.features.filter((_, idx) => idx !== featureIndex);
                                return { ...item, features: features.length ? features : ["Новое преимущество"] };
                              });
                              return { ...prev, pricingOptions };
                            })
                          }
                          aria-label="Удалить преимущество"
                        >
                          −
                        </button>
                      )}
                    </div>
                  ))}
                  {isAdmin && (
                    <button
                      type="button"
                      className={`${styles.controlButton} ${styles.addButton}`}
                      onClick={() =>
                        setContentState((prev) => {
                          const pricingOptions = prev.pricingOptions.map((item, index) =>
                            index === optionIndex
                              ? { ...item, features: [...item.features, "Новое преимущество"] }
                              : item,
                          );
                          return { ...prev, pricingOptions };
                        })
                      }
                      aria-label="Добавить преимущество"
                    >
                      +
                    </button>
                  )}
                </div>
                {isAdmin && (
                  <div className={styles.inlineControls}>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() =>
                        setContentState((prev) => {
                          const pricingOptions = prev.pricingOptions.length === 1
                            ? [createEmptyPricingOption()]
                            : prev.pricingOptions.filter((_, idx) => idx !== optionIndex);
                          return { ...prev, pricingOptions };
                        })
                      }
                      aria-label="Удалить тариф"
                    >
                      −
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
            <button
              type="button"
              className={`${styles.controlButton} ${styles.addCardButton}`}
              onClick={() =>
                setContentState((prev) => ({
                  ...prev,
                  pricingOptions: [...prev.pricingOptions, createEmptyPricingOption()],
                }))
              }
              aria-label="Добавить тариф"
            >
              + Добавить тариф
            </button>
          )}
        </section>

        <section className={styles.section} id="registration">
          <h2 className={styles.sectionHeading}>Регистрация и оплата</h2>
          <div className={styles.registrationSteps}>
            <div className={styles.registrationStep}>
              <div className={styles.registrationStepHeader}>
                <span className={styles.registrationStepNumber}>1</span>
                <span>Заполните форму регистрации с вашими контактными данными</span>
              </div>
            </div>
            <div className={styles.registrationStep}>
              <div className={styles.registrationStepHeader}>
                <span className={styles.registrationStepNumber}>2</span>
                <span>
                  Оплатите участие по реквизитам, полученным на email, который вы указали при регистрации
                </span>
              </div>
            </div>
            <div className={styles.registrationStep}>
              <div className={styles.registrationStepHeader}>
                <span className={styles.registrationStepNumber}>3</span>
                <span>После подтверждения оплаты получите ссылку на Zoom</span>
              </div>
            </div>
          </div>
          <div className={styles.registrationButtonContainer}>
            <a 
              href="https://forms.gle/6DKLwvSLYGK5oMA3A"
          target="_blank"
          rel="noopener noreferrer"
              className={styles.registrationButton}
            >
              Зарегистрироваться через форму
            </a>
          </div>
          <div className={styles.registrationNotifications}>
            <EditableText
              tag="h3"
              value={registrationNotifications.title}
              canEdit={isAdmin}
              className={styles.registrationNotificationsTitle}
              onChange={(nextValue) =>
                setContentState((prev) => ({
                  ...prev,
                  registrationNotifications: {
                    ...prev.registrationNotifications,
                    title: nextValue,
                  },
                }))
              }
            />
            <div className={styles.registrationNotificationsList}>
              {registrationNotifications.items.map((item, index) => (
                <div key={`${item}-${index}`} className={styles.notificationRow}>
                  <EditableText
                    tag="p"
                    value={`• ${item}`}
                    canEdit={isAdmin}
                    onChange={(nextValue) =>
                      setContentState((prev) => {
                        const cleaned = nextValue.replace(/^•\s*/, "");
                        const items = prev.registrationNotifications.items.map((entry, idx) =>
                          idx === index ? cleaned : entry,
                        );
                        return {
                          ...prev,
                          registrationNotifications: {
                            ...prev.registrationNotifications,
                            items,
                          },
                        };
                      })
                    }
                  />
                  {isAdmin && (
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() =>
                        setContentState((prev) => {
                          const items = prev.registrationNotifications.items.filter((_, idx) => idx !== index);
                          return {
                            ...prev,
                            registrationNotifications: {
                              ...prev.registrationNotifications,
                              items: items.length ? items : ["Новый пункт"],
                            },
                          };
                        })
                      }
                      aria-label="Удалить уведомление"
                    >
                      −
                    </button>
                  )}
                </div>
              ))}
              {isAdmin && (
                <button
                  type="button"
                  className={`${styles.controlButton} ${styles.addButton}`}
                  onClick={() =>
                    setContentState((prev) => ({
                      ...prev,
                      registrationNotifications: {
                        ...prev.registrationNotifications,
                        items: [...prev.registrationNotifications.items, "Новый пункт"],
                      },
                    }))
                  }
                  aria-label="Добавить уведомление"
                >
                  +
                </button>
              )}
            </div>
          </div>
          
          <div className={styles.contactSection}>
            <EditableText
              tag="h3"
              value={contactSection.title}
              canEdit={isAdmin}
              className={styles.contactSectionTitle}
              onChange={(nextValue) =>
                setContentState((prev) => ({
                  ...prev,
                  contactSection: {
                    ...prev.contactSection,
                    title: nextValue,
                  },
                }))
              }
            />
            <div className={styles.contactInfo}>
              <a
                href={phoneHref || undefined}
                className={`${styles.contactItem} ${styles.contactLink}`}
                onClick={(event) => {
                  if (isAdmin) {
                    event.preventDefault();
                  }
                }}
              >
                <EditableText
                  tag="span"
                  value={contactSection.phone}
                  canEdit={isAdmin}
                  className={`${styles.contactText} ${styles.contactPhone}`}
                  onChange={(nextValue) =>
                    setContentState((prev) => ({
                      ...prev,
                      contactSection: {
                        ...prev.contactSection,
                        phone: nextValue,
                      },
                    }))
                  }
                />
              </a>
              <a
                href={emailHref || undefined}
                className={`${styles.contactItem} ${styles.contactLink}`}
                onClick={(event) => {
                  if (isAdmin) {
                    event.preventDefault();
                  }
                }}
              >
                <EditableText
                  tag="span"
                  value={contactSection.email}
                  canEdit={isAdmin}
                  className={`${styles.contactText} ${styles.contactEmail}`}
                  onChange={(nextValue) =>
                    setContentState((prev) => ({
                      ...prev,
                      contactSection: {
                        ...prev.contactSection,
                        email: nextValue,
                      },
                    }))
                  }
                />
              </a>
              <a
                href={websiteHref || undefined}
                className={`${styles.contactItem} ${styles.contactLink}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  if (isAdmin) {
                    event.preventDefault();
                  }
                }}
              >
                <EditableText
                  tag="span"
                  value={contactSection.website}
                  canEdit={isAdmin}
                  className={`${styles.contactText} ${styles.contactWebsite}`}
                  onChange={(nextValue) =>
                    setContentState((prev) => ({
                      ...prev,
                      contactSection: {
                        ...prev.contactSection,
                        website: nextValue,
                      },
                    }))
                  }
                />
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <p>Конференция: Актуальные вопросы гештальт-терапии</p>
          </div>
          <div className={styles.footerActions}>
            {!isAdmin ? (
              <button type="button" className={styles.loginButton} onClick={handleOpenLogin}>
                Войти как администратор
              </button>
            ) : (
              <button type="button" className={styles.loginButton} onClick={handleLogout}>
                Выйти
              </button>
            )}
          </div>
        </div>
      </footer>

      {isLoginModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <button
              type="button"
              className={styles.modalClose}
              aria-label="Закрыть"
              onClick={handleCloseLogin}
            >
              ×
            </button>
            <h3 className={styles.modalTitle}>Вход администратора</h3>
            <form className={styles.modalForm} onSubmit={handleLoginSubmit}>
              <label className={styles.modalLabel}>
                Логин
                <input
                  type="text"
                  value={login}
                  className={styles.modalInput}
                  onChange={(event) => setLogin(event.target.value)}
                  autoFocus
                />
              </label>
              <label className={styles.modalLabel}>
                Пароль
                <input
                  type="password"
                  value={password}
                  className={styles.modalInput}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {loginError && <div className={styles.modalError}>{loginError}</div>}
              <button type="submit" className={styles.modalSubmit}>
                Войти
              </button>
            </form>
          </div>
        </div>
      )}
      {status !== "idle" && (
        <div className={styles.toast}>
          {status === "loading" && "Загрузка данных..."}
          {status === "saving" && "Сохранение..."}
          {status === "error" && (error ?? "Произошла ошибка")}
        </div>
      )}
    </div>
  );
}
