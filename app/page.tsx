"use client";
import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { board, events, opportunities, workshops } from "./site-content";

const teams =
  "https://teams.microsoft.com/meet/242053094361812?p=DPfiRc8FW4X8wmHchU";
const officerApplication = "https://forms.cloud.microsoft/r/FdjQE5SiKE";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const sitePath = (path: string) => `${basePath}${path}`;
const homeNav = [
  ["#board", "Student Board"],
  ["#opportunities", "Resources"],
  ["#events", "Upcoming Events"],
  ["/transfer", "Transfer Roadmap"],
  ["#contact", "Contact Us"],
];
const transferNav = [
  ["/", "Main Page"],
  ["/#board", "Student Board"],
  ["/#opportunities", "Resources"],
  ["/#events", "Upcoming Events"],
  ["/transfer", "Transfer Roadmap"],
  ["/#contact", "Contact Us"],
];
const studentNeeds = [
  {
    label: "I want to transfer",
    title: "Make your transfer plan feel doable",
    text: "Find scholarships, application guidance, and students who understand the process.",
  },
  {
    label: "I need experience",
    title: "Build experience before graduation",
    text: "Explore internships, research, volunteering, and leadership opportunities you can actually use.",
  },
  {
    label: "I could use support",
    title: "Get help without figuring it out alone",
    text: "Connect with campus resources, practical workshops, and peers who are ready to help.",
  },
  {
    label: "I want community",
    title: "Meet people beyond the classroom",
    text: "Join service projects, social events, and activities where you can relax and belong.",
  },
];
const leadershipDepartments = [
  {
    key: "executive",
    title: "Executive Board",
    openRoles: [] as string[],
  },
  {
    key: "events",
    title: "Event Coordination",
    openRoles: [] as string[],
  },
  {
    key: "public-relations",
    title: "Public Relations",
    openRoles: [] as string[],
  },
  {
    key: "icc",
    title: "Inter-Club Council",
    openRoles: [] as string[],
  },
  {
    key: "technology",
    title: "Technology",
    openRoles: ["Technology Lead", "Technology Members"],
  },
];

export function ClubSite({ view = "home" }: { view?: "home" | "transfer" }) {
  const [eventFilter, setEventFilter] = useState("All");
  const [menu, setMenu] = useState(false);
  const [studentNeed, setStudentNeed] = useState(0);
  const [revealedEmails, setRevealedEmails] = useState<Set<string>>(
    () => new Set(),
  );
  const shownEvents =
    eventFilter === "All"
      ? events
      : events.filter((x) => x.type === eventFilter);
  const sendInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");
    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:honorssocietiesclub@gmail.com?subject=${subject}&body=${body}`;
  };
  const toggleEmail = (email: string) => {
    setRevealedEmails((current) => {
      const next = new Set(current);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };
  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", closeMenu);
    return () => window.removeEventListener("keydown", closeMenu);
  }, []);
  useEffect(() => {
    const main = document.querySelector<HTMLElement>(`.site-view-${view}`);
    if (!main) return;
    const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("reveal-visible"));
      return;
    }
    main.classList.add("motion-ready");
    sections.forEach((section) => section.classList.add("reveal-section"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [view]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(`.site-view-${view} > section`),
    ).filter((section) => window.getComputedStyle(section).display !== "none");
    const sceneStyles = [
      "scene-rise",
      "scene-down",
      "scene-left",
      "scene-right",
      "scene-diagonal-left",
      "scene-diagonal-right",
      "scene-zoom",
      "scene-tilt",
      "scene-wipe",
      "scene-wipe-reverse",
    ];
    sections.forEach((section, index) =>
      section.classList.add("section-transition", sceneStyles[index % sceneStyles.length]),
    );
    let frame = 0;
    const updateScrollMotion = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const available = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--page-scroll", String(scrollTop));
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(available > 0 ? Math.min(1, scrollTop / available) : 0),
      );
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.height === 0) return;
        const entry = Math.max(
          0,
          Math.min(
            1,
            (viewportHeight * 0.98 - rect.top) / (viewportHeight * 0.52),
          ),
        );
        section.style.setProperty("--section-entry", String(entry));
      });
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollMotion);
    };
    updateScrollMotion();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      sections.forEach((section) => {
        section.classList.remove("section-transition");
        sceneStyles.forEach((style) => section.classList.remove(style));
        section.style.removeProperty("--section-entry");
      });
    };
  }, [view]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <header>
        <Link className="brand" href="/" prefetch={false}>
          <b>H</b>
          <span>
            <strong>Honors Societies Club</strong>
            <small>East Los Angeles College</small>
          </span>
        </Link>
        <button
          type="button"
          className="menu"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="primary-navigation"
        >
          Menu
        </button>
        <nav id="primary-navigation" className={menu ? "open" : ""}>
          {(view === "home" ? homeNav : transferNav).map(([href, label]) => {
            const resolvedHref = href.startsWith("/") ? sitePath(href) : href;
            return (
              <a
                key={href}
                href={resolvedHref}
                onClick={() => setMenu(false)}
                aria-current={view === "transfer" && href === "/transfer" ? "page" : undefined}
              >
                {label}
              </a>
            );
          })}
          <a
            className="pill"
            href={officerApplication}
            target="_blank"
            rel="noreferrer"
          >
            Join Us
          </a>
        </nav>
      </header>
      <main id="main" className={`site-view-${view}`}>
        <section id="home" className="hero pad">
          <div>
            <p className="eyebrow">Curiosity · Community · Achievement</p>
            <h1>
              Go further,
              <br />
              <em>together.</em>
            </h1>
            <p className="lede">
              College is already a lot to navigate. Honors Societies Club helps
              you find useful opportunities, meet people who get it, and take
              the next step without doing everything alone.
            </p>
            <div className="actions">
              <a
                className="button primary"
                href={officerApplication}
                target="_blank"
                rel="noreferrer"
              >
                Become a member →
              </a>
              <a className="button outline" href="#events">
                See what’s happening
              </a>
            </div>
          </div>
          <div className="hero-card">
            <div className="circle" />
            <p>START WHERE YOU ARE</p>
            <h3>What do you need right now?</h3>
            <div
              className="need-buttons"
              role="group"
              aria-label="Choose a student goal"
            >
              {studentNeeds.map((need, index) => (
                <button
                  type="button"
                  key={need.label}
                  aria-pressed={studentNeed === index}
                  aria-label={
                    index === 0
                      ? "I want to transfer — open the roadmap and university requirements"
                      : need.label
                  }
                  className={studentNeed === index ? "active" : ""}
                  onClick={() => {
                    setStudentNeed(index);
                    if (index === 0) window.location.href = sitePath("/transfer");
                    if (index === 1) window.location.hash = "opportunities";
                    if (index === 2) window.location.hash = "resources";
                    if (index === 3) window.location.hash = "events";
                  }}
                >
                  <span>0{index + 1}</span>
                  {need.label}
                  {index === 0 && " →"}
                </button>
              ))}
            </div>
            <div className="need-detail" aria-live="polite">
              <strong>{studentNeeds[studentNeed].title}</strong>
              <p>{studentNeeds[studentNeed].text}</p>
            </div>
          </div>
        </section>
        <section className="notice meeting-hub" aria-labelledby="meeting-hub-title">
          <div className="meeting-intro">
            <p className="meeting-label"><span /> CLUB MEETINGS ONLINE</p>
            <h2 id="meeting-hub-title">Meet us on Microsoft Teams.</h2>
            <p>
              Join our general meetings to hear club updates, plan activities,
              and connect with fellow Honors students.
            </p>
            <a className="meeting-button" href={teams} target="_blank" rel="noreferrer">
              Join the club meeting ↗
            </a>
            <small>
              Meeting ID: 242 053 094 361 812 · Request the passcode through
              the club contact form.
            </small>
          </div>
          <div className="meeting-details">
            <div className="meeting-row">
              <span>01</span>
              <div>
                <small>WHEN WE MEET</small>
                <h3>Every other Friday</h3>
                <p>General meetings begin September 4, 2026, and continue biweekly.</p>
              </div>
            </div>
            <div className="meeting-row">
              <span>02</span>
              <div>
                <small>WHERE UPDATES APPEAR</small>
                <h3>Updates from our Official Platforms</h3>
                <p>
                  Event notifications are shared through HSC’s official
                  Instagram, Discord channel, and the Honors Program in Canvas.
                </p>
                <div className="meeting-links">
                  <a href="https://www.instagram.com/elachonors/" target="_blank" rel="noreferrer">Instagram ↗</a>
                  <a href="https://discord.gg/CtY4fM3yUq" target="_blank" rel="noreferrer">Discord ↗</a>
                </div>
              </div>
            </div>
            <div className="meeting-row">
              <span>03</span>
              <div>
                <small>WHAT WE OFFER</small>
                <h3>Transfer guidance that meets you where you are</h3>
                <p>
                  Our regular workshops simplify the transfer process for all
                  students, with added support for first generation,
                  undocumented, low income, disabled, current or former foster
                  youth, veteran, and housing insecure students.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="pad split">
          <div>
            <p className="eyebrow">About the club</p>
            <h2>Honors is more than a designation.</h2>
          </div>
          <div className="copy">
            <p>
              Honors Societies Club is an academic club affiliated with the East
              Los Angeles College Honors Program. We create a welcoming space
              where motivated students exchange ideas, build lasting
              connections, and prepare for what comes next.
            </p>
            <p>
              Our programming brings together academic support, transfer
              preparation, career development, service, and community—so
              students do not have to navigate the journey alone.
            </p>
          </div>
        </section>
        <section id="board" className="pad cream">
          <Heading
            kicker="Meet the board"
            title="Students leading students."
          />
          <div className="leadership-departments">
            {leadershipDepartments.map((department) => {
              const members = board.filter((member) =>
                member.departments.includes(department.key),
              );
              return (
                <section
                  className="leadership-department"
                  data-department={department.key}
                  key={department.key}
                >
                  <div className="department-heading">
                    <p className="eyebrow">{department.title}</p>
                  </div>
                  <div
                    className="department-row"
                    tabIndex={
                      members.length + (department.openRoles.length > 0 ? 1 : 0) > 1
                        ? 0
                        : undefined
                    }
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                        event.preventDefault();
                        event.currentTarget.scrollBy({
                          left: event.key === "ArrowRight" ? 300 : -300,
                        });
                      }
                    }}
                    aria-label={`${department.title} leadership profiles`}
                  >
                    {department.openRoles.length > 0 && (
                      <aside className="department-open">
                        <small>OPEN LEADERSHIP OPPORTUNITIES</small>
                        <div className="open-role-titles">
                          {department.openRoles.map((role) => (
                            <h4 key={role}>{role}</h4>
                          ))}
                        </div>
                        <a
                          className="open-role-apply"
                          href={officerApplication}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Apply to Join ↗
                        </a>
                      </aside>
                    )}
                    {members.map((member, index) => (
                      <article
                        className={`board-card board-card-${member.name
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                        key={`${department.key}-${member.email}`}
                      >
                        <div
                          className={`portrait portrait-${member.name
                            .toLowerCase()
                            .replaceAll(" ", "-")} p${index}`}
                        >
                          {member.photo ? (
                            <span className="portrait-frame">
                              <img
                                src={sitePath(member.photo)}
                                alt={`${member.name}, ${member.role} of Honors Societies Club`}
                                loading="lazy"
                                decoding="async"
                              />
                            </span>
                          ) : (
                            <span>{member.initials}</span>
                          )}
                          <i
                            className="portrait-sticker portrait-sticker-star"
                            aria-hidden="true"
                          >
                            ✦
                          </i>
                          <i
                            className="portrait-sticker portrait-sticker-heart"
                            aria-hidden="true"
                          >
                            ♡
                          </i>
                          <i
                            className="portrait-sticker portrait-sticker-flower"
                            aria-hidden="true"
                          >
                            ✿
                          </i>
                        </div>
                        <b className="officer-role">{member.role}</b>
                        <h3>{member.name}</h3>
                        <div className="officer-actions">
                          {member.linkedin ? (
                            <a
                              className="officer-action linkedin"
                              href={member.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${member.name}'s LinkedIn profile`}
                            >
                              in
                            </a>
                          ) : (
                            <span
                              className="officer-action linkedin disabled"
                              title="LinkedIn profile coming soon"
                              aria-label={`${member.name}'s LinkedIn profile is coming soon`}
                            >
                              in
                            </span>
                          )}
                          <button
                            type="button"
                            className="officer-action email"
                            onClick={() => toggleEmail(member.email)}
                            aria-expanded={revealedEmails.has(member.email)}
                            aria-controls={`email-${department.key}-${index}`}
                            aria-label={`${revealedEmails.has(member.email) ? "Hide" : "Show"} ${member.name}'s ELAC email`}
                          >
                            ✉
                          </button>
                        </div>
                        {revealedEmails.has(member.email) && (
                          <div
                            className="email-reveal"
                            id={`email-${department.key}-${index}`}
                          >
                            <span>ELAC EMAIL</span>
                            <a href={`mailto:${member.email}`}>{member.email}</a>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
        <section id="opportunities" className="pad">
          <Heading
            kicker="Resources"
            title="Support for what comes next."
            text="Explore college resources and scholarship opportunities shared by the club. This will be regularly updated by Honors Societies Club."
          />
          <div className="resource-shortcuts" aria-label="Official student resource links">
            <a href="https://assist.org/" target="_blank" rel="noreferrer">
              <small>TRANSFER PLANNING</small>
              <strong>ASSIST</strong>
              <span>Official California course articulation ↗</span>
            </a>
            <a href="https://elacfoundation.com/" target="_blank" rel="noreferrer">
              <small>ELAC SCHOLARSHIPS</small>
              <strong>ELAC Foundation</strong>
              <span>Explore scholarships for ELAC students ↗</span>
            </a>
            <a
              href="https://www.ptk.org/scholarships/how-our-scholarships-work/"
              target="_blank"
              rel="noreferrer"
            >
              <small>MEMBER SCHOLARSHIPS</small>
              <strong>Phi Theta Kappa</strong>
              <span>View PTK scholarship opportunities ↗</span>
            </a>
          </div>
          <section className="fws-resource" aria-labelledby="fws-title">
            <div className="fws-resource-main">
              <p className="eyebrow">Student employment</p>
              <span className="status green">Interest form</span>
              <h3 id="fws-title">Interested in Federal Work-Study?</h3>
              <p>
                ELAC Financial Aid is exploring student interest in the Federal
                Work-Study Program. Eligible students may earn money and gain
                experience through part-time employment on campus or with an
                approved community service organization.
              </p>
              <ul className="fws-benefits">
                <li>Earn income that can help with educational expenses.</li>
                <li>Build professional experience and practical career skills.</li>
                <li>Strengthen your resume for future employment opportunities.</li>
                <li>Work in an environment that supports academic success.</li>
              </ul>
              <p className="fws-disclaimer">
                Submitting an interest form does not guarantee eligibility or
                placement. Students must meet program requirements, and funding
                and available positions are limited.
              </p>
              <div className="fws-actions">
                <a
                  className="button primary"
                  href="https://www.elac.edu/financial-aid"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit ELAC Financial Aid ↗
                </a>
                <a className="button outline" href="mailto:finaid@elac.edu">
                  Email Financial Aid
                </a>
              </div>
              <small className="fws-form-note">
                Use ELAC’s current Federal Work-Study interest form when it is
                provided by Financial Aid. If the form is not visible on the
                official page, contact the office to request the current link.
              </small>
            </div>
            <aside className="fws-office" aria-label="ELAC Financial Aid Office information">
              <p className="eyebrow">Questions?</p>
              <h4>Financial Aid Office</h4>
              <p>
                E1 Student Services Building, Room 135
                <br />
                <a href="tel:+13232658738">323-265-8738</a>
              </p>
              <dl>
                <div><dt>Monday</dt><dd>9:00 AM–5:00 PM</dd></div>
                <div><dt>Tuesday</dt><dd>9:00 AM–6:00 PM</dd></div>
                <div><dt>Wednesday</dt><dd>9:00 AM–6:00 PM</dd></div>
                <div><dt>Thursday</dt><dd>9:00 AM–5:00 PM</dd></div>
                <div><dt>Friday</dt><dd>8:00 AM–12:00 PM</dd></div>
                <div><dt>First Saturday</dt><dd>9:00 AM–1:00 PM</dd></div>
              </dl>
              <small>
                Hours are subject to change. Computer lab services are not
                available on the first Saturday of the month.
              </small>
            </aside>
          </section>
          <div className="opportunity-groups">
            {["ELAC Resource", "Scholarship"].map((type) => (
              <section
                className="opportunity-group"
                key={type}
                aria-labelledby={`opportunity-${type.replace(" ", "-").toLowerCase()}`}
              >
                <p className="eyebrow">
                  {type === "ELAC Resource" ? "ELAC resources" : "Scholarships"}
                </p>
                <h3 id={`opportunity-${type.replace(" ", "-").toLowerCase()}`}>
                  {type === "ELAC Resource"
                    ? "Support from your college"
                    : "Funding for your transfer journey"}
                </h3>
                {opportunities
                  .filter((x) => x.type === type)
                  .map((x) => (
                    <article className="opportunity-feature" key={x.title}>
                      <div>
                        <span className="status green">{x.status}</span>
                        <span className="tag">{x.type}</span>
                      </div>
                      <h4>{x.title}</h4>
                      <b>{x.organization}</b>
                      <p>{x.eligibility}</p>
                      <dl>
                        <div>
                          <dt>
                            {x.type === "Scholarship"
                              ? "Deadline"
                              : "Availability"}
                          </dt>
                          <dd>{x.deadline}</dd>
                        </div>
                      </dl>
                      <p className="opportunity-note">{x.note}</p>
                      <a
                        className="button primary"
                        href={x.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {x.linkLabel} ↗
                      </a>
                    </article>
                  ))}
              </section>
            ))}
          </div>
        </section>
        <section id="success" className="pad dark">
          <Heading
            kicker="Academic & career success"
            title="Skills for the next step."
            text="Practical workshops, thoughtful speakers, and peer support designed around the moments that matter."
          />
          <div className="workshops">
            {workshops.map((x, i) => (
              <article key={x.title}>
                <span>0{i + 1}</span>
                <small>{x.topic} · SAMPLE</small>
                <h3>{x.title}</h3>
                <p>{x.description}</p>
                <div>
                  <b>{x.date}</b>
                  <b>{x.location}</b>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="official-apps">
          <p>Official transfer links</p>
          <div>
            <a href="https://assist.org/" target="_blank" rel="noreferrer">
              ASSIST ↗
            </a>
            <a
              href="https://apply.universityofcalifornia.edu/"
              target="_blank"
              rel="noreferrer"
            >
              UC application ↗
            </a>
            <a
              href="https://uctap.universityofcalifornia.edu/"
              target="_blank"
              rel="noreferrer"
            >
              UC TAP & TAG ↗
            </a>
            <a
              href="https://www.calstate.edu/apply"
              target="_blank"
              rel="noreferrer"
            >
              Cal State Apply ↗
            </a>
            <a
              href="https://www.commonapp.org/apply/transfer-students"
              target="_blank"
              rel="noreferrer"
            >
              Common App Transfer ↗
            </a>
            <a
              href="https://studentaid.gov/h/apply-for-aid/fafsa"
              target="_blank"
              rel="noreferrer"
            >
              FAFSA ↗
            </a>
            <a
              href="https://dream.csac.ca.gov/"
              target="_blank"
              rel="noreferrer"
            >
              CA Dream Act ↗
            </a>
            <a
              href="https://mygrantinfo.csac.ca.gov/"
              target="_blank"
              rel="noreferrer"
            >
              Cal Grant ↗
            </a>
          </div>
        </section>
        <section id="transfer" className="pad transfer-guide">
          <Heading
            kicker="Fall 2027 applicants"
            title="Your transfer year, mapped out."
            text="A month-by-month roadmap for students applying in 2026–27, followed by separate university application guides."
            level={1}
          />
          <div className="transfer-compass" aria-label="Three transfer planning priorities">
            <article>
              <span>01</span>
              <div>
                <small>PLAN</small>
                <h3>Match every course</h3>
                <p>Use ASSIST and official university requirements before building your schedule.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <small>PREPARE</small>
                <h3>Track every deadline</h3>
                <p>Keep applications, financial aid, transcripts, and supplemental materials in one calendar.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <small>APPLY</small>
                <h3>Tell a clear story</h3>
                <p>Show what you learned at ELAC and why each university is the right next step.</p>
              </div>
            </article>
          </div>
          <div className="timeline">
            <article>
              <b>AUG 2026</b>
              <h3>Build your application list</h3>
              <p>
                The UC application opens August 1. Create UC, Cal State Apply,
                Common App Transfer, UC TAP and CSU Transfer Planner accounts.
                Check every major on ASSIST and request unofficial transcripts
                for review.
              </p>
            </article>
            <article>
              <b>SEP 2026</b>
              <h3>Submit UC TAG</h3>
              <p>
                Fall 2027 UC TAG applications are filed September 1–30 through
                UC TAP. TAG is not filed in October. Only one TAG campus may be
                selected, and a separate UC application is still required.
              </p>
            </article>
            <article>
              <b>OCT 2026</b>
              <h3>CSU filing begins</h3>
              <p>
                Cal State Apply submission opens October 1. Finalize UC Personal
                Insight Questions, enter every college and course exactly, and
                begin FAFSA or California Dream Act materials when available.
              </p>
            </article>
            <article>
              <b>NOV 2026</b>
              <h3>Submit UC and CSU</h3>
              <p>
                Submit the UC application November 1–30. CSU fall applications
                generally run October 1–December 1, but confirm each campus and
                impacted major deadline.
              </p>
            </article>
            <article>
              <b>DEC 2026–JAN 2027</b>
              <h3>Update and verify</h3>
              <p>
                Save every applicant-portal login. The UC Transfer Academic
                Update opens December 15 and has a January 31 priority deadline
                for fall 2027. Report fall grades and all planned spring/summer
                courses.
              </p>
            </article>
            <article>
              <b>FEB–MAR 2027</b>
              <h3>Private and highly selective deadlines</h3>
              <p>
                USC is due February 15 for most majors. Harvard, Yale and
                Princeton are due March 1; NYU, Stanford and Cornell are
                generally due March 15. Submit financial-aid forms and program
                supplements by each school’s deadline.
              </p>
            </article>
            <article>
              <b>MAR–MAY 2027</b>
              <h3>Review decisions</h3>
              <p>
                UC transfer decisions arrive from March 1 through May 1. Compare
                admission, major placement, transferable credit, housing and the
                full financial-aid offer—not just the university name.
              </p>
            </article>
            <article>
              <b>JUN–JUL 2027</b>
              <h3>Commit and send records</h3>
              <p>
                UC transfer SIR deadline is June 1. UC final official
                transcripts are due July 1 and AP/IB or Cal-GETC documents July
                15. Follow the selected university’s own deadlines if attending
                elsewhere.
              </p>
            </article>
          </div>
          <div className="honors-transfer">
            <p className="eyebrow">
              Exceptional pathway for ELAC Honors students
            </p>
            <h3>Plan for UCLA TAP and UCI Honors to Honors consideration</h3>
            <p>
              Complete <b>five ELAC Honors courses plus LIB SCI 101 Honors</b>.
              Earn at least a C in each course and maintain a 3.0 Honors GPA and
              cumulative GPA. A B or better is recommended. LIB SCI 101 is
              required separately and does not count as one of the five courses.
            </p>
            <p>
              <b>
                You do not need all six courses finished when the UC application
                opens.
              </b>{" "}
              List unfinished fall and spring courses as planned or in progress.
              Complete all requirements by your final ELAC spring term and meet
              the Honors counselor’s paperwork deadlines, especially for UCLA
              TAP certification. Approved certification appears on your official
              transcript. Priority consideration does not guarantee admission,
              and some majors may not participate.
            </p>
            <div className="chapter-actions">
              <a
                className="button primary"
                href="https://www.elac.edu/academics/honors/about"
                target="_blank"
                rel="noreferrer"
              >
                ELAC Honors requirements ↗
              </a>
              <a
                className="button outline"
                href="https://admission.ucla.edu/apply/transfer/ucla-transfer-alliance-program"
                target="_blank"
                rel="noreferrer"
              >
                UCLA TAP ↗
              </a>
            </div>
          </div>
          <div className="application-guides">
            <article>
              <p className="eyebrow">University of California</p>
              <h3>UC campuses</h3>
              <p>
                <b>Apply:</b> UC application; TAG through UC TAP for Davis,
                Irvine, Merced, Riverside, Santa Barbara or Santa Cruz.
              </p>
              <p>
                <b>Basic eligibility:</b> 60 UC-transferable semester units, at
                least a 2.4 transferable GPA for California residents, the
                seven-course pattern with C or better, and campus/major
                preparation. Competitive programs require more.
              </p>
              <a
                href="https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-transfer/"
                target="_blank"
                rel="noreferrer"
              >
                Official UC transfer guide ↗
              </a>
            </article>
            <article>
              <p className="eyebrow">California State University</p>
              <h3>CSU campuses</h3>
              <p>
                <b>Apply:</b> Cal State Apply. An ADT can provide priority and a
                systemwide admission guarantee, but not necessarily to a
                specific campus or major.
              </p>
              <p>
                <b>Basic eligibility:</b> 60 transferable semester units, 30 GE
                units, 2.0 transferable GPA, good standing, and C- or better in
                oral communication, written communication, critical thinking and
                quantitative reasoning. Impacted majors may require more.
              </p>
              <a
                href="https://www.calstate.edu/apply/transfer"
                target="_blank"
                rel="noreferrer"
              >
                Official CSU transfer guide ↗
              </a>
            </article>
            <article>
              <p className="eyebrow">California private universities</p>
              <h3>USC and other private campuses</h3>
              <p>
                <b>Apply:</b> Usually Common App Transfer; check each campus.
                USC requires the Common App plus official high-school and all
                college transcripts; recommendations depend on the major.
              </p>
              <p>
                <b>Prepare:</b> Strong grades, required writing and major
                preparation, essays, and any portfolio/audition. Examples to
                research include USC, Stanford, LMU, Chapman, Occidental, Pomona
                and Pitzer.
              </p>
              <a
                href="https://admission.usc.edu/prospective-students/how-to-apply/transfer-students/"
                target="_blank"
                rel="noreferrer"
              >
                USC transfer requirements ↗
              </a>
            </article>
            <article>
              <p className="eyebrow">NYU</p>
              <h3>New York University</h3>
              <p>
                <b>Deadline:</b> March 15 for summer/fall external transfer;
                October 15 for spring. Program deadlines and artistic
                supplements may differ.
              </p>
              <p>
                <b>Typical materials:</b> Common App Transfer, official college
                transcripts, high-school transcript or equivalency,
                school-specific questions and any required portfolio/audition.
                Some schools request recommendations.
              </p>
              <a
                href="https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply/transfer-applicants.html"
                target="_blank"
                rel="noreferrer"
              >
                NYU transfer information ↗
              </a>
            </article>
            <article>
              <p className="eyebrow">Ivy League examples</p>
              <h3>Harvard, Yale, Princeton and Cornell</h3>
              <p>
                <b>Deadlines:</b> Harvard, Yale and Princeton March 1; Cornell
                March 15. Verify annually.
              </p>
              <p>
                <b>Typical materials:</b> Common App Transfer or the school’s
                named platform, every college transcript, high-school
                transcript, College Report, essays and usually two academic
                recommendations. Harvard and Yale require standardized testing;
                Princeton requests a graded paper and is test-optional for fall
                2027.
              </p>
              <a
                href="https://www.commonapp.org/apply/transfer-students"
                target="_blank"
                rel="noreferrer"
              >
                Common App Transfer ↗
              </a>
            </article>
            <article>
              <p className="eyebrow">Top-tier universities</p>
              <h3>Stanford and other selective schools</h3>
              <p>
                <b>Stanford deadline:</b> March 15. Required materials include
                Common App, official high-school and all college transcripts,
                College Report, two academic recommendations and ACT or SAT
                scores.
              </p>
              <p>
                <b>Strategy:</b> Requirements differ sharply. Build a balanced
                list, explain your academic reason for transferring, and verify
                credit residency, major eligibility and financial aid before
                applying.
              </p>
              <a
                href="https://admission.stanford.edu/apply/transfer/"
                target="_blank"
                rel="noreferrer"
              >
                Stanford transfer requirements ↗
              </a>
            </article>
          </div>
          <div className="transfer-tools">
            <h3>Application tools and records</h3>
            <div className="links">
              <a href="https://assist.org/" target="_blank" rel="noreferrer">
                ASSIST major articulation<span>↗</span>
              </a>
              <a
                href="https://uctap.universityofcalifornia.edu/"
                target="_blank"
                rel="noreferrer"
              >
                UC TAP and TAG<span>↗</span>
              </a>
              <a
                href="https://www.calstate.edu/apply/transfer/Pages/csu-transfer-planner.aspx"
                target="_blank"
                rel="noreferrer"
              >
                CSU Transfer Planner<span>↗</span>
              </a>
              <a
                href="https://www.commonapp.org/apply/transfer-students"
                target="_blank"
                rel="noreferrer"
              >
                Common App Transfer<span>↗</span>
              </a>
              <a
                href="https://www.parchment.com/"
                target="_blank"
                rel="noreferrer"
              >
                Order official transcripts with Parchment<span>↗</span>
              </a>
            </div>
            <p className="resource-note">
              <b>Always verify before submitting.</b> Deadlines and requirements
              can change by term, campus, major, residency and applicant
              history. Meet with an ELAC transfer or Honors counselor and use
              each university’s official admissions page as the final authority.
            </p>
          </div>
        </section>
        <section id="financial-aid" className="pad aid-scholarships">
          <Heading
            kicker="Financial aid & campus scholarships"
            title="Do not leave free money on the table."
            text="Start early, use official applications, and confirm each scholarship’s current deadline before submitting."
          />
          <div className="aid-deadlines">
            <article>
              <b>OCT 2026</b>
              <h3>FAFSA or CADAA</h3>
              <p>
                For fall 2027 transfer, submit the 2027–28 FAFSA—or the
                California Dream Act Application if eligible—as soon as the
                application becomes available. College and state priority
                deadlines arrive much earlier than the final federal deadline.
              </p>
              <a
                href="https://studentaid.gov/h/apply-for-aid/fafsa"
                target="_blank"
                rel="noreferrer"
              >
                Open the official FAFSA ↗
              </a>
              <a
                href="https://dream.csac.ca.gov/"
                target="_blank"
                rel="noreferrer"
              >
                Open the CA Dream Act application ↗
              </a>
            </article>
            <article>
              <b>MAR 2, 2027</b>
              <h3>California priority deadline</h3>
              <p>
                Target March 2, 2027 for FAFSA or CADAA and GPA verification for
                Cal Grant consideration. Create a WebGrants 4 Students account
                to check Cal Grant and Middle Class Scholarship tasks. Do not
                wait if a university posts an earlier aid deadline.
              </p>
              <a
                href="https://mygrantinfo.csac.ca.gov/"
                target="_blank"
                rel="noreferrer"
              >
                Check Cal Grant status ↗
              </a>
              <a
                href="https://www.elac.edu/financial-aid/apply"
                target="_blank"
                rel="noreferrer"
              >
                ELAC financial-aid instructions ↗
              </a>
            </article>
          </div>
          <div className="campus-scholarships">
            <article>
              <h3>ELAC Foundation scholarships</h3>
              <p>
                ELAC Foundation awards may include Southern California Edison
                STEM, David Morin Mathematics, Max and Marie Offenberg, Gladys
                German Memorial, Blanca Flanagan Rios, and several English
                Department scholarships. Awards and names can change each cycle.
              </p>
              <p>
                <b>Typical reference requirements:</b> ELAC must be the home
                college; the Spring 2026 cycle required enrollment in at least
                six ELAC units. Eligibility varies by GPA, major, units,
                financial need or other donor criteria.
              </p>
              <a
                href="https://www.elac.edu/financial-aid"
                target="_blank"
                rel="noreferrer"
              >
                ELAC Financial Aid & Scholarship Office ↗
              </a>
            </article>
            <article>
              <h3>Where to check every term</h3>
              <p>
                Visit the Financial Aid and Scholarship Office in E1-135, review
                current ELAC scholarship announcements, and ask academic
                departments about their awards. Also check ELAC Honors, EOPS and
                the ELAC Foundation for new opportunities.
              </p>
              <p>
                <b>ELAC codes:</b> FAFSA 001222 · California Dream Act 022260.
              </p>
              <a
                href="https://www.elac.edu/sites/elac.edu/files/2026-02/ELAC%20Spring%202026%20Scholarships%20Flyer.pdf"
                target="_blank"
                rel="noreferrer"
              >
                View the latest located ELAC scholarship flyer ↗
              </a>
            </article>
          </div>
          <p className="resource-note">
            <b>Important information:</b> Honors Societies Club shares these
            opportunities for informational purposes only. HSC is not
            affiliated with the organizations listed and is not responsible for
            changes to awards, eligibility requirements, application decisions,
            or deadlines. Applicants must confirm all current details directly
            with the official scholarship provider before applying.
          </p>
        </section>
        <section id="events" className="pad">
          <Heading
            kicker="Fall semester"
            title="Our Club’s upcoming events."
            text="Discover campus resources, community service, fundraisers, and social events."
          />
          <Filters
            items={[
              "All",
              "Campus Resource",
              "Community Service",
              "Fundraiser",
              "Social Events",
            ]}
            active={eventFilter}
            set={setEventFilter}
          />
          <div className="event-grid" aria-live="polite">
            {shownEvents.map((x) => (
              <article className="event" key={x.title}>
                <div className="date">
                  <strong>{x.day}</strong>
                  <span>{x.month}</span>
                </div>
                <div>
                  {(x.tags ?? [x.type]).map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                  {!x.confirmed && <span className="tag">Tentative sample</span>}
                  <h3>{x.title}</h3>
                  <p>{x.description}</p>
                  <small>
                    {x.time} · {x.locationLink ? (
                      <a href={x.locationLink} target="_blank" rel="noreferrer">
                        {x.location} ↗
                      </a>
                    ) : x.location}
                  </small>
                </div>
              </article>
            ))}
            {shownEvents.length === 0 && (
              <div className="event-empty">
                <span>✦</span>
                <h3>Coming Up Soon.</h3>
                <p>
                  We are planning the next {eventFilter.toLowerCase()} update.
                  Check back for the announcement.
                </p>
              </div>
            )}
          </div>
        </section>
        <section className="pad instagram-section" aria-labelledby="instagram-title">
          <div className="instagram-heading">
            <div>
              <p className="eyebrow">Updates from our Official Platforms</p>
              <h2 id="instagram-title">Latest from ELAC Honors.</h2>
              <p>
                Fresh from @elachonors: class finds, campus news, and the posts
                worth stopping your scroll for.
              </p>
            </div>
            <a
              href="https://www.instagram.com/elachonors/"
              target="_blank"
              rel="noreferrer"
            >
              Follow @elachonors ↗
            </a>
          </div>
          <div
            className="instagram-carousel"
            tabIndex={0}
            aria-label="Recent ELAC Honors Instagram posts"
          >
            <a
              className="instagram-card instagram-poster spanish"
              href="https://www.instagram.com/elachonors/p/DcPKZMWS3Ac/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="instagram-art"><span>H</span><b>ESPAÑOL</b></div>
              <div className="instagram-copy">
                <small>AUGUST 19, 2026 · NEWEST POST</small>
                <h3>Honors Spanish 10</h3>
                <p>Latin American Civilization with Professor Nora Zepeda · Fall 2026 · Section 24339.</p>
              </div>
            </a>
            <a
              className="instagram-card"
              href="https://www.instagram.com/elachonors/p/DcPJBLUy70d/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={sitePath("/instagram-post-2.png")}
                alt="ELAC Honors Instagram post promoting Philosophy 20 for Fall 2026"
                loading="lazy"
                decoding="async"
              />
              <div className="instagram-copy">
                <small>AUGUST 19, 2026</small>
                <h3>Philosophy 20</h3>
                <p>Professor G. Villaseñor · Tuesdays and Thursdays · Fall 2026.</p>
              </div>
            </a>
            <a
              className="instagram-card instagram-poster lyrics"
              href="https://www.instagram.com/elachonors/p/DcKBhihSX_e/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="instagram-art"><span>♪</span><b>LYRICS FOR THE SOUL</b></div>
              <div className="instagram-copy">
                <small>AUGUST 17, 2026</small>
                <h3>English C1000</h3>
                <p>Explore language, music, and meaning in an Honors English course.</p>
              </div>
            </a>
            <a
              className="instagram-card instagram-poster community"
              href="https://www.instagram.com/elachonors/p/DbeGFmGBJcf/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="instagram-art"><span>✦</span><b>HONORS COMMUNITY</b></div>
              <div className="instagram-copy">
                <small>JULY 31, 2026</small>
                <h3>Lyrics for the Soul</h3>
                <p>Another look at the Honors English experience for Fall 2026.</p>
              </div>
            </a>
            <a
              className="instagram-card instagram-poster discord"
              href="https://www.instagram.com/elachonors/p/DbZKFMmhn5G/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="instagram-art"><span>◎</span><b>STAY CONNECTED</b></div>
              <div className="instagram-copy">
                <small>JULY 29, 2026</small>
                <h3>Join the community</h3>
                <p>Connect with ELAC Honors students and receive community updates.</p>
              </div>
            </a>
          </div>
          <p className="instagram-note">
            Public post previews checked August 24, 2026. Follow @elachonors
            for the newest updates.
          </p>
        </section>
        <section id="resources" className="pad cream">
          <Heading
            kicker="Membership pathways"
            title="Interested in PTK or AGS?"
            text="Honors Societies Club is a chapter of both Phi Theta Kappa and Alpha Gamma Sigma. Here is how students can get started."
          />
          <div className="chapter-grid">
            <article className="chapter-card">
              <span className="chapter-mark">PTK</span>
              <p className="eyebrow">Phi Theta Kappa</p>
              <h3>Join the ELAC PTK chapter</h3>
              <ol>
                <li>Maintain a 3.5 GPA for the current semester.</li>
                <li>
                  Qualified students will receive an invitation from Dr.
                  Blandon, Honors Program Director.
                </li>
                <li>
                  After accepting the invitation, register on the PTK website
                  and activate your code.
                </li>
                <li>
                  Once your account and PTK resources are active, you are an
                  official PTK member.
                </li>
              </ol>
              <a
                className="button primary"
                href="https://join.ptk.org/"
                target="_blank"
                rel="noreferrer"
              >
                Join PTK ↗
              </a>
            </article>
            <article className="chapter-card">
              <span className="chapter-mark">AGS</span>
              <p className="eyebrow">Alpha Gamma Sigma</p>
              <h3>Join the ELAC AGS chapter</h3>
              <ol>
                <li>
                  Bring $10 in cash and complete the AGS application at the
                  Honors Center, Room E3-270.
                </li>
                <li>
                  Take the completed application to the Fiscal Office in G1-107.
                </li>
                <li>
                  Pay the $10 membership fee. Membership becomes official once
                  payment is received.
                </li>
              </ol>
              <div className="chapter-actions">
                <a
                  className="button primary"
                  href="https://www.elac.edu/about/map"
                  target="_blank"
                  rel="noreferrer"
                >
                  View ELAC map ↗
                </a>
                <a
                  className="button outline"
                  href="https://www.agshonor.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  AGS official site ↗
                </a>
              </div>
            </article>
          </div>
          <p className="resource-note">
            <b>Please confirm current requirements before applying.</b>{" "}
            Eligibility, fees, rooms, and procedures may change. Contact the
            ELAC Honors Center if you have questions.
          </p>
        </section>
        <section id="join" className="pad join">
          <div className="join-copy">
            <p className="eyebrow">Join the student board</p>
            <h2>Turn your ideas into impact.</h2>
            <p>
              Apply for an Honors Societies Club officer position and help
              shape future events, resources, and student opportunities.
            </p>
            <a
              className="button light"
              href={officerApplication}
              target="_blank"
              rel="noreferrer"
            >
              Open the officer application ↗
            </a>
          </div>
          <figure className="officer-application-card">
            <a href={officerApplication} target="_blank" rel="noreferrer">
              <img
                src={sitePath("/officer-application-qr.png")}
                alt="QR code for the Honors Societies Club officer application"
                loading="lazy"
                decoding="async"
              />
            </a>
            <figcaption>Scan to open the officer application</figcaption>
          </figure>
        </section>
        <section id="contact" className="pad contact-layout">
          <div>
            <p className="eyebrow">Contact us</p>
            <h2>Send us a question.</h2>
            <p className="copy">
              Use the inquiry form or email the club directly. You can also scan
              our community QR code to receive event and activity updates.
            </p>
            <a
              className="email-link"
              href="mailto:honorssocietiesclub@gmail.com"
            >
              honorssocietiesclub@gmail.com
            </a>
            <p className="contact-address">
              Honors Societies Club
              <br />
              Honors Center, Room E3-270
              <br />
              East Los Angeles College - Monterey Park Campus
              <br />
              1301 Avenida Cesar Chavez
              <br />
              Monterey Park, CA 91754
            </p>
            <figure className="qr-card contact-qr">
              <img
                src={sitePath("/join-qr.jpeg")}
                alt="QR code to join Honors Societies Club and receive club notifications"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Scan to join the club community</figcaption>
            </figure>
          </div>
          <form className="inquiry-form" onSubmit={sendInquiry}>
            <div>
              <label htmlFor="inquiry-name">Name *</label>
              <input id="inquiry-name" name="name" placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="inquiry-email">Email address *</label>
              <input
                id="inquiry-email"
                name="email"
                type="email"
                placeholder="Your email address"
                required
              />
            </div>
            <div>
              <label htmlFor="inquiry-message">Message *</label>
              <textarea
                id="inquiry-message"
                name="message"
                rows={7}
                placeholder="How can we help?"
                required
              />
            </div>
            <button className="button primary" type="submit">Send inquiry →</button>
            <small>Submitting opens your email app with the message ready to send.</small>
          </form>
        </section>
      </main>
      <footer>
        <div className="brand">
          <b>H</b>
          <span>
            <strong>Honors Societies Club</strong>
            <small>East Los Angeles College</small>
          </span>
        </div>
        <p>Student-led. Academically driven. Community minded.</p>
        <small>
          Honors Societies Club is a student-led council striving to enhance
          fellow student scholars’ experiences throughout their transfer
          journeys. External websites and opportunities are shared for
          educational convenience only and do not imply endorsement,
          partnership, or affiliation. Details, eligibility requirements,
          deadlines, and availability may change. Always verify information
          directly with the official organization before applying or making
          decisions.
        </small>
      </footer>
    </>
  );
}

export default function Home() {
  return <ClubSite view="home" />;
}

function Heading({
  kicker,
  title,
  text,
  level = 2,
}: {
  kicker: string;
  title: string;
  text?: string;
  level?: 1 | 2;
}) {
  const Title = level === 1 ? "h1" : "h2";
  return (
    <div className="heading">
      <div>
        <p className="eyebrow">{kicker}</p>
        <Title>{title}</Title>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}
function Filters({
  items,
  active,
  set,
}: {
  items: string[];
  active: string;
  set: (x: string) => void;
}) {
  return (
    <div className="filters">
      {items.map((x) => (
        <button
          type="button"
          className={x === active ? "active" : ""}
          onClick={() => set(x)}
          aria-pressed={x === active}
          key={x}
        >
          {x}
        </button>
      ))}
    </div>
  );
}
