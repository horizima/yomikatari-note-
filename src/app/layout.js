export const metadata = {
  title: "よみかたりノート",
  description: "読み語りサークルの記録アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
