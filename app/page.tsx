import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Layout from "@/components/Layout";
import Login from "@/components/Login";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return <div className="App">{session ? <Layout /> : <Login />}</div>;
}
