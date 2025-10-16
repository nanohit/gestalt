'use client';

import Image from "next/image";
import styles from "./page.module.css";

const programSchedule = [
  {
    date: "24 ноября",
    sessions: [
      {
        time: "10:00\u00a0-\u00a011:30",
        type: "Пленарная сессия",
        title: "Основы гештальт-терапии в современном контексте",
        description: "Основной доклад",
      },
      {
        time: "11:45 - 13:15",
        type: "Семинар",
        title: "Работа с травмой через призму гештальт-подхода",
        description: "Практический семинар",
      },
      {
        time: "13:15 - 14:00",
        type: "Дискуссия",
        title: "Обсуждения и QA",
        description: "Интерактивная сессия",
      },
    ],
  },
  {
    date: "25 ноября",
    sessions: [
      {
        time: "10:00\u00a0-\u00a011:30",
        type: "Пленарная сессия",
        title: "Контакт и поддержка в онлайн-терапии",
        description: "Методологический доклад",
      },
      {
        time: "11:45 - 13:15",
        type: "Мастер-класс",
        title: "Полевые процессы в групповой работе",
        description: "Групповой опыт",
      },
      {
        time: "13:15 - 14:00",
        type: "Супервизия",
        title: "Супервизорские группы: обмен опытом",
        description: "Интерактивная сессия",
      },
    ],
  },
  {
    date: "26 ноября",
    sessions: [
      {
        time: "10:00\u00a0-\u00a011:30",
        type: "Пленарная сессия",
        title: "Контакт и поддержка в онлайн-терапии",
        description: "Методологический доклад",
      },
      {
        time: "11:45 - 13:15",
        type: "Мастер-класс",
        title: "Полевые процессы в групповой работе",
        description: "Групповой опыт",
      },
      {
        time: "13:15 - 14:00",
        type: "Супервизия",
        title: "Супервизорские группы: обмен опытом",
        description: "Интерактивная сессия",
      },
    ],
  },
];

const speakers = [
  {
    name: "Анна Петрова",
    role: "Ведущий гештальт-терапевт",
    experience: "15+ лет практики",
    description:
      "Специалист по работе с терапевтическим опытом. Автор публикаций по современным подходам в гештальт-терапии.",
    tags: ["Контакт", "Поддержка", "Травма и восстановление"],
  },
  {
    name: "Михаил Иванов",
    role: "Супервизор, тренер",
    experience: "20+ лет практики",
    description:
      "Эксперт в области групповых процессов и полевых феноменов. Ведущий программ подготовки терапевтов.",
    tags: ["Супервизия", "Обучение", "Групповая терапия"],
  },
  {
    name: "Дмитрий Козлов",
    role: "Философ, терапевт",
    experience: "18 лет практики",
    description:
      "Специалист по работе с травматическим опытом. Автор публикаций по современным подходам в гештальт-терапии.",
    tags: ["Философия", "Современность", "Этика терапии"],
  },
  {
    name: "Елена Смирнова",
    role: "Клинический психолог",
    experience: "12 лет практики",
    description:
      "Пионер в области онлайн гештальт-терапии. Исследователь цифровых особенностей контакта в цифровом пространстве.",
    tags: ["Контакт", "Онлайн-практика", "Интеграция"],
  },
];

const pricing = [
  {
    label: "Лучшая цена",
    period: "До 20 октября",
    price: "6 000₽",
    features: [
      "Доступ ко всем сессиям",
      "Материалы конференции",
      "Сертификат участника",
      "Запись всех выступлений",
    ],
    highlight: true,
  },
  {
    period: "С 20 октября",
    price: "7 000₽",
    features: [
      "Доступ ко всем сессиям",
      "Материалы конференции",
      "Сертификат участника",
      "Запись всех выступлений",
    ],
  },
  {
    period: "С 17 ноября и в день начала",
    price: "8 000₽",
    features: [
      "Доступ ко всем сессиям",
      "Материалы конференции",
      "Сертификат участника",
      "Запись всех выступлений",
    ],
  },
];

export default function Home() {
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
            {programSchedule.map((day, index) => (
              <div key={`${day.date}-${index}`} className={styles.programColumn}>
                <div className={styles.programColumnHeader}>{day.date}</div>
                <div className={styles.programColumnBody}>
                  {day.sessions.map((session, sessionIndex) => (
                    <div key={`${day.date}-${sessionIndex}`} className={styles.sessionCard}>
                      <div className={styles.sessionMeta}>
                        <span className={styles.sessionTime}>{session.time}</span>
                        <span className={styles.sessionType}>{session.type}</span>
                      </div>
                      <div className={styles.sessionTitle}>{session.title}</div>
                      <div className={styles.sessionDescription}>
                        {session.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} id="speakers">
          <h2 className={styles.sectionHeading}>Спикеры конференции</h2>
          <div className={styles.speakersGrid}>
            {speakers.map((speaker) => (
              <div key={speaker.name} className={styles.speakerCard}>
                <div className={styles.speakerPhoto} />
                <div>
                  <div className={styles.speakerName}>{speaker.name}</div>
                  <div className={styles.speakerRole}>{speaker.role}</div>
                  <div className={styles.speakerExperience}>{speaker.experience}</div>
                </div>
                <div className={styles.speakerDescription}>{speaker.description}</div>
                <div className={styles.speakerTags}>
                  {speaker.tags.map((tag) => (
                    <span key={tag} className={styles.speakerTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} id="pricing">
          <h2 className={styles.sectionHeading}>Стоимость участия</h2>
          <div className={styles.pricingGrid}>
            {pricing.map((option) => (
              <div
                key={option.period}
                className={`${styles.priceCard} ${option.highlight ? styles.highlight : ""}`}
              >
                {option.label && <span className={styles.priceBadge}>{option.label}</span>}
                <span className={styles.pricePeriod}>{option.period}</span>
                <span className={styles.priceValue}>{option.price}</span>
                <div className={styles.priceFeatures}>
                  {option.features.map((feature) => (
                    <span key={feature}>• {feature}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.pricingDiscount}>
            <p className={styles.pricingDiscountTitle}>Скидка для участников программ МГИ</p>
            <p className={styles.pricingDiscountText}>
              Скидка 1000₽ для всех, кто проходит или проходил обучение в Московском гештальт институте. Укажите это при регистрации.
            </p>
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
        </div>
      </footer>
    </div>
  );
}
