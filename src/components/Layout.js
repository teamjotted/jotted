import Header from "./Header";
import Sidebar from "./Topbar";

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
