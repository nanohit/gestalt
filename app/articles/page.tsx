"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EditableText from "@/app/components/EditableText";
import { useSiteContent } from "@/app/hooks/useSiteContent";
import { useAdminAuth } from "@/app/hooks/useAdminAuth";
import { createEmptyArticle } from "@/app/lib/content";
import pageStyles from "../page.module.css";
import styles from "./articles.module.css";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "dea282c8a3ed6b4d82eed4ea65ab3826";
const COLLAPSE_CHAR_LIMIT = 600;

export default function ArticlesPage() {
  const {
    isAdmin,
    isLoginModalOpen,
    login,
    password,
    loginError,
    setLogin,
    setPassword,
    handleOpenLogin,
    handleCloseLogin,
    handleLoginSubmit,
    handleLogout,
  } = useAdminAuth();
  const { content, status, error, setContentState } = useSiteContent(isAdmin);
  const { articles, articlesHeading, articlesSubtitle } = content;
  const [bodyDrafts, setBodyDrafts] = useState<string[]>(() => articles.map((article) => article.body));
  const [expandedArticles, setExpandedArticles] = useState<boolean[]>(() => articles.map(() => false));

  useEffect(() => {
    setBodyDrafts((prevDrafts) => {
      const nextDrafts = articles.map((article) => article.body);
      if (prevDrafts.length === nextDrafts.length && prevDrafts.every((draft, index) => draft === nextDrafts[index])) {
        return prevDrafts;
      }
      return nextDrafts;
    });
  }, [articles]);

  useEffect(() => {
    setExpandedArticles((prevExpanded) => {
      if (prevExpanded.length === articles.length) {
        return prevExpanded;
      }
      const nextExpanded = articles.map((_, index) => prevExpanded[index] ?? false);
      return nextExpanded;
    });
  }, [articles]);

  const handleArticleFieldChange = useCallback(
    (index: number, field: "title" | "date" | "author" | "body" | "photoUrl", value: string) => {
      setContentState((prev) => {
        const nextArticles = prev.articles.map((article, articleIndex) =>
          articleIndex === index ? { ...article, [field]: value } : article,
        );
        return { ...prev, articles: nextArticles };
      });
    },
    [setContentState],
  );

  const handleBodyDraftChange = useCallback((index: number, value: string) => {
    setBodyDrafts((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleBodySave = useCallback(
    (index: number) => {
      const draft = bodyDrafts[index] ?? "";
      handleArticleFieldChange(index, "body", draft);
    },
    [bodyDrafts, handleArticleFieldChange],
  );

  const handleAddArticle = useCallback(() => {
    const emptyArticle = createEmptyArticle();
    setBodyDrafts((prev) => [...prev, emptyArticle.body]);
    setExpandedArticles((prev) => [...prev, true]);
    setContentState((prev) => ({
      ...prev,
      articles: [...prev.articles, emptyArticle],
    }));
  }, [setContentState]);

  const handleRemoveArticle = useCallback(
    (index: number) => {
      if (!window.confirm("Вы действительно хотите удалить эту статью?")) {
        return;
      }
      setContentState((prev) => {
        if (prev.articles.length === 1) {
          const emptyArticle = createEmptyArticle();
          setBodyDrafts([emptyArticle.body]);
          setExpandedArticles([true]);
          return { ...prev, articles: [emptyArticle] };
        }
        const nextArticles = prev.articles.filter((_, articleIndex) => articleIndex !== index);
        setBodyDrafts(nextArticles.map((article) => article.body));
        setExpandedArticles((prevExpanded) =>
          prevExpanded.filter((_, expandedIndex) => expandedIndex !== index),
        );
        return { ...prev, articles: nextArticles };
      });
    },
    [setContentState],
  );

  const handleMoveArticle = useCallback(
    (index: number, direction: "up" | "down") => {
      const toIndex = direction === "up" ? index - 1 : index + 1;
      if (toIndex < 0 || toIndex >= articles.length) {
        return;
      }
      const reorderList = <T,>(list: T[]): T[] => {
        const next = [...list];
        const [item] = next.splice(index, 1);
        next.splice(toIndex, 0, item);
        return next;
      };
      setBodyDrafts((prevDrafts) => reorderList(prevDrafts));
      setExpandedArticles((prevExpanded) => reorderList(prevExpanded));
      setContentState((prev) => ({
        ...prev,
        articles: reorderList(prev.articles),
      }));
    },
    [articles.length, setContentState],
  );

  const handleToggleArticleExpansion = useCallback((index: number) => {
    setExpandedArticles((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const uploadArticlePhoto = useCallback(
    async (index: number, file: File) => {
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
        handleArticleFieldChange(index, "photoUrl", payload.data.url);
      } catch (err) {
        console.error("Failed to upload article photo", err);
        alert(
          err instanceof Error ? err.message : "Не удалось загрузить изображение. Попробуйте позже.",
        );
      }
    },
    [handleArticleFieldChange],
  );

  const statusMessage = useMemo(() => {
    if (status === "loading") return "Загрузка данных...";
    if (status === "saving") return "Сохранение...";
    if (status === "error") return error ?? "Произошла ошибка";
    return null;
  }, [status, error]);

  return (
    <div className={`${pageStyles.page} ${styles.page}`}>
      <header className={pageStyles.header}>
        <div className={pageStyles.headerContainer}>
          <div className={pageStyles.logoWrapper}>
            <Image
              src="/logo1.png"
              alt="Логотип 1"
              width={120}
              height={60}
              className={pageStyles.logoImage}
              priority
            />
            <Image
              src="/logo2.png"
              alt="Логотип 2"
              width={120}
              height={66}
              className={pageStyles.logoImage}
              priority
            />
          </div>
          <nav className={pageStyles.nav}>
            <Link href="/articles" className={`${pageStyles.navLink} ${styles.activeNavLink}`}>
              Статьи
            </Link>
            <Link href="/#program" className={pageStyles.navLink}>
              Программа
            </Link>
            <Link href="/#speakers" className={pageStyles.navLink}>
              Спикеры
            </Link>
            <Link href="/#pricing" className={pageStyles.navLink}>
              Стоимость
            </Link>
            <Link href="/#registration" className={pageStyles.navLink}>
              Регистрация
            </Link>
          </nav>
        </div>
      </header>

      <div className={pageStyles.container}>
        <section className={`${pageStyles.section} ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <EditableText
              tag="h1"
              value={articlesHeading}
              canEdit={isAdmin}
              className={styles.sectionTitle}
              onChange={(value) =>
                setContentState((prev) => ({
                  ...prev,
                  articlesHeading: value,
                }))
              }
            />
            <EditableText
              tag="p"
              value={articlesSubtitle}
              canEdit={isAdmin}
              className={styles.sectionSubtitle}
              onChange={(value) =>
                setContentState((prev) => ({
                  ...prev,
                  articlesSubtitle: value,
                }))
              }
            />
          </div>

          <div className={styles.articleList}>
            {articles.map((article, index) => {
              const draftValue = bodyDrafts[index] ?? article.body;
              const isDraftDirty = draftValue !== article.body;
              const isExpanded = expandedArticles[index] ?? false;
              const trimmedBody = article.body.trim();
              const shouldTruncate = !isAdmin && trimmedBody.length > COLLAPSE_CHAR_LIMIT;
              const previewText = shouldTruncate && !isExpanded
                ? `${trimmedBody.slice(0, COLLAPSE_CHAR_LIMIT).replace(/\s+\S*$/, "").trim()}…`
                : trimmedBody;
              const paragraphsToRender = (isAdmin ? draftValue : previewText).split(/\n{2,}/);
              return (
                <article key={`${article.title}-${index}`} className={styles.articleCard}>
                  <div className={styles.articleHeader}>
                    <EditableText
                      tag="h2"
                      value={article.title}
                      canEdit={isAdmin}
                      className={styles.articleTitle}
                      onChange={(value) => handleArticleFieldChange(index, "title", value)}
                    />
                    <EditableText
                      tag="div"
                      value={article.date}
                      canEdit={isAdmin}
                      className={styles.articleDate}
                      onChange={(value) => handleArticleFieldChange(index, "date", value)}
                    />
                    <div className={styles.articleAuthorRow}>
                      <div className={styles.articlePhotoWrapper}>
                        {article.photoUrl ? (
                          <Image
                            src={article.photoUrl}
                            alt={article.title || "Фото автора"}
                            fill
                            sizes="48px"
                            className={styles.articlePhotoImage}
                          />
                        ) : (
                          <div className={styles.articlePhotoPlaceholder}>Фото</div>
                        )}
                        {isAdmin && (
                          <label className={styles.articlePhotoUpload} aria-label="Загрузить фото">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                await uploadArticlePhoto(index, file);
                                event.target.value = "";
                              }}
                            />
                          </label>
                        )}
                      </div>
                      <EditableText
                        tag="div"
                        value={article.author}
                        canEdit={isAdmin}
                        className={styles.articleAuthor}
                        onChange={(value) => handleArticleFieldChange(index, "author", value)}
                      />
                    </div>
                  </div>

                  <div className={styles.articleBody}>
                    {isAdmin ? (
                      <>
                        <textarea
                          className={styles.articleBodyTextarea}
                          value={draftValue}
                          onChange={(event) => handleBodyDraftChange(index, event.target.value)}
                          placeholder="Текст статьи"
                        />
                        <div className={styles.articleBodyActions}>
                          <button
                            type="button"
                            className={styles.saveButton}
                            onClick={() => handleBodySave(index)}
                            disabled={!isDraftDirty}
                          >
                            Сохранить
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        className={`${styles.articleBodyContent} ${
                          shouldTruncate && !isExpanded ? styles.articleBodyContentCollapsed : ""
                        }`}
                      >
                        {paragraphsToRender.map((paragraph, paragraphIndex) => (
                          <p key={`${article.title}-${paragraphIndex}`}>{paragraph}</p>
                        ))}
                        {shouldTruncate && (
                          <button
                            type="button"
                            className={styles.articleToggleButton}
                            onClick={() => handleToggleArticleExpansion(index)}
                          >
                            {isExpanded ? "Свернуть" : "Читать полностью"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className={styles.articleControls}>
                      <div className={styles.articleReorderControls}>
                        <button
                          type="button"
                          className={styles.reorderButton}
                          onClick={() => handleMoveArticle(index, "up")}
                          disabled={index === 0}
                          aria-label="Переместить статью вверх"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={styles.reorderButton}
                          onClick={() => handleMoveArticle(index, "down")}
                          disabled={index === articles.length - 1}
                          aria-label="Переместить статью вниз"
                        >
                          ↓
                        </button>
                      </div>
                      <button
                        type="button"
                        className={pageStyles.controlButton}
                        onClick={() => handleRemoveArticle(index)}
                        aria-label="Удалить статью"
                      >
                        Удалить статью
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
            {articles.length === 0 && (
              <div className={styles.emptyState}>Нет статей. Добавьте новую публикацию.</div>
            )}
          </div>

          {isAdmin && (
            <button
              type="button"
              className={`${pageStyles.controlButton} ${styles.addArticleButton}`}
              onClick={handleAddArticle}
            >
              + Добавить статью
            </button>
          )}
        </section>
      </div>

      <footer className={pageStyles.footer}>
        <div className={pageStyles.footerContainer}>
          <div className={pageStyles.footerContent}>
            <p>Конференция: Актуальные вопросы гештальт-терапии</p>
          </div>
          <div className={pageStyles.footerActions}>
            {!isAdmin ? (
              <button type="button" className={pageStyles.loginButton} onClick={handleOpenLogin}>
                Войти как администратор
              </button>
            ) : (
              <button type="button" className={pageStyles.loginButton} onClick={handleLogout}>
                Выйти
              </button>
            )}
          </div>
          <p className={pageStyles.footerNote}>2025 Все права защищены.</p>
        </div>
      </footer>

      {isLoginModalOpen && (
        <div className={pageStyles.modalOverlay} role="dialog" aria-modal="true">
          <div className={pageStyles.modalContent}>
            <button
              type="button"
              className={pageStyles.modalClose}
              aria-label="Закрыть"
              onClick={handleCloseLogin}
            >
              ×
            </button>
            <h3 className={pageStyles.modalTitle}>Вход администратора</h3>
            <form className={pageStyles.modalForm} onSubmit={handleLoginSubmit}>
              <label className={pageStyles.modalLabel}>
                Логин
                <input
                  type="text"
                  value={login}
                  className={pageStyles.modalInput}
                  onChange={(event) => setLogin(event.target.value)}
                  autoFocus
                />
              </label>
              <label className={pageStyles.modalLabel}>
                Пароль
                <input
                  type="password"
                  value={password}
                  className={pageStyles.modalInput}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {loginError && <div className={pageStyles.modalError}>{loginError}</div>}
              <button type="submit" className={pageStyles.modalSubmit}>
                Войти
              </button>
            </form>
          </div>
        </div>
      )}

      {statusMessage && <div className={pageStyles.toast}>{statusMessage}</div>}
    </div>
  );
}
