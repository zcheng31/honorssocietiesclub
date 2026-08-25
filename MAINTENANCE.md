# Honors Societies Club Website Guide

This site is intentionally simple: the page layout is in `app/page.tsx`, the design is in `app/globals.css`, and frequently updated club content is in `app/site-content.ts`.

## Every semester

1. Confirm the board roster and get written approval for names, photos, biographies, and contact links.
2. Update opportunities, workshops, and events in `app/site-content.ts`. Preserve the separate ELAC Resources and Scholarships categories.
3. Remove expired listings or update their status.
4. Confirm the Microsoft Teams link and meeting ID in `app/page.tsx`. Never add a passcode to the public repository.
5. Confirm that `honorssocietiesclub@gmail.com` remains the official club email and that `public/join-qr.jpeg` still scans to the correct club platform.
6. Have two officers review dates, links, spelling, and accessibility before publishing.

## Ownership and renewals

- Hosting: OpenAI Sites. Record the owner account and one backup officer in the club transition notes.
- Domain: No paid custom domain is required. If the club later buys one, use a club-controlled account, record its annual renewal date, enable automatic renewal, and keep payment details current.
- Source backup: At the end of every semester, download or copy the complete site folder into a club-controlled drive. Keep at least the latest two semester copies.
- Transfer: Before officers leave, transfer hosting and any domain access to the next board, verify that the new owner can publish, and remove former officers after the handoff succeeds.

## Recovery and moving hosts

The site keeps content in plain text files and does not require a database. Keep a complete copy of the source folder. If the current host is discontinued, a developer can build the site and move the generated files to another static or edge-compatible host. The Microsoft Teams link and contact method are independent of hosting.

## Five-year maintenance rhythm

- Monthly during semesters: check deadlines, event statuses, and links.
- Each semester: update officers, events, workshops, opportunities, and meeting details.
- Annually: review accessibility, privacy, domain renewal, account ownership, dependencies, and backups.
- Before any leadership transition: complete the ownership-transfer checklist above.

## Privacy and safety

Do not publish meeting passcodes, personal phone numbers, private email addresses, student IDs, or member lists. Use officer-approved club contact channels and obtain permission for every photo and biography.
