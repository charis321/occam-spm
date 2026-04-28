export default function OCError(props) {
  const { code, message } = props;
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{code}</h1>
      <p>{message}</p>
    </div>
  );
}

export function OC404() {
  return <OCError code="404 Not Found" message="您訪問的頁面不存在" />;
}

// export function OC404() {
//   return <img src="../../../public/images/404.png" alt="404 Not Found" />;
// }
export function OC403() {
  return <OCError code="403 Forbidden" message="您沒有權限訪問此頁面" />;
}
export function OC500() {
  return (
    <OCError
      code="500 Internal Server Error"
      message="伺服器發生錯誤，請稍後再試"
    />
  );
}
