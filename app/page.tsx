'use client';

import { createElement, useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, Ref } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { createEmptyDay, createEmptyPricingOption, createEmptySession, createEmptySpeaker } from "@/app/lib/content";
import { useSiteContent } from "@/app/hooks/useSiteContent";

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
  const { programDays, speakers: speakerItems, pricingOptions, discountTitle, discountText } = content;

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
            <Image src="/logo1.png" alt="Логотип 1" width={200} height={100} />
            <Image src="/logo2.png" alt="Логотип 2" width={200} height={110} />
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
            <Image src="/logo1.png" alt="Логотип 1" width={180} height={90} style={{ objectFit: 'contain' }} />
            <Image src="/logo2.png" alt="Логотип 2" width={180} height={99} style={{ objectFit: 'contain' }} />
          </div>
          <div className={styles.heroInner}>
            <div>
              <p className={styles.heroConferenceLabel}>Конференция:</p>
              <h1 className={styles.heroHeading}>
                Актуальные вопросы
                <br />
                гештальт терапии
              </h1>
              <p className={styles.heroSubheading}>
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
                <div className={styles.speakerPhoto} />
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
          <div className={styles.pricingDiscount}>
            <EditableText
              tag="p"
              value={discountTitle}
              canEdit={isAdmin}
              className={styles.pricingDiscountTitle}
              onChange={(nextValue) =>
                setContentState((prev) => ({
                  ...prev,
                  discountTitle: nextValue,
                }))
              }
            />
            <EditableText
              tag="p"
              value={discountText}
              canEdit={isAdmin}
              className={styles.pricingDiscountText}
              onChange={(nextValue) =>
                setContentState((prev) => ({
                  ...prev,
                  discountText: nextValue,
                }))
              }
            />
          </div>
        </section>

        <section className={styles.section} id="registration">
          <h2 className={styles.sectionHeading}>Регистрация и оплата</h2>
          <div className={styles.registrationSteps}>
            <div className={styles.registrationStep}>
              <div className={styles.registrationStepHeader}>
                <span className={styles.registrationStepNumber}>1</span>
                <span>Заполните форму регистрации с вашими контактными данными.</span>
              </div>
            </div>
            <div className={styles.registrationStep}>
              <div className={styles.registrationStepHeader}>
                <span className={styles.registrationStepNumber}>2</span>
                <span>
                  Оплатите участие по реквизитам, полученным на email, который вы указали при регистрации.
                </span>
              </div>
            </div>
            <div className={styles.registrationStep}>
              <div className={styles.registrationStepHeader}>
                <span className={styles.registrationStepNumber}>3</span>
                <span>После подтверждения оплаты получите ссылку на Zoom.</span>
              </div>
            </div>
          </div>
          <div className={styles.registrationButtonContainer}>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScfVd6cwN_jouQnH_PvdA1a98fBcegP3Jb_VCfrJ8YgHamxhQ/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
              className={styles.registrationButton}
            >
              Зарегистрироваться через форму
            </a>
          </div>
          <div className={styles.registrationNotifications}>
            <h3 className={styles.registrationNotificationsTitle}>Автоматические уведомления:</h3>
            <div className={styles.registrationNotificationsList}>
              <p>• Подтверждение регистрации приходит сразу после заполнения формы.</p>
              <p>• Подтверждение оплаты и ссылка на Zoom — после поступления оплаты.</p>
              <p>• Напоминание и ссылка — за день до начала конференции</p>
            </div>
          </div>
          
          <div className={styles.contactSection}>
            <h3 className={styles.contactSectionTitle}>Контакты организаторов</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactPhone}>+7 495 123-45-67</span>
              </div>
              <div className={styles.contactItem}>
                <a href="mailto:info@gestalt.ru" className={styles.contactEmail}>info@gestalt.ru</a>
              </div>
              <div className={styles.contactItem}>
                <a href="https://gestalt.ru" target="_blank" rel="noopener noreferrer" className={styles.contactWebsite}>gestalt.ru</a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <p>©2025 Московский гештальт институт.</p>
            <p>Время работы: Пн-Пг 10:00-18:00 МСК.</p>
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
