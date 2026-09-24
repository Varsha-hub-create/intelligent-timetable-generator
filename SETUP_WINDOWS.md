# Windows Setup

1. Install Node.js LTS.
2. Open PowerShell in `backend`.
3. Run `npm install`.
4. Run `npx prisma generate`.
5. Run `npx prisma migrate dev --name init`.
6. Run `npm run seed`.
7. Run `npm run dev`.
8. Open another terminal, go to `frontend`, run `npm install` and `npm run dev`.
9. Open the Vite URL shown in the terminal.

If PowerShell blocks npm.ps1, run:
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
