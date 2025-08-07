/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // اذا كتخدم ب React أو ملفات JS/TS
    // أضف هنا أي مسار فيه ملفات كود تستعمل tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
