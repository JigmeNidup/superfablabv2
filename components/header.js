import { useState } from "react";
import { useRouter } from "next/router";
import { Layout, Menu, Button, Affix } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";

import Image from "next/image";
import logo from "../public/assets/img/logo.png";

const { Content } = Layout;
const { Item, SubMenu } = Menu;

export default function Header({ isLoggedIn, users, children }) {
  const role = users === null ? null : users.role;
  const [login_state, setLogin] = useState(isLoggedIn);

  // when user logged in

  const router = useRouter();

  const Logout = async () => {
    let response = await fetch("/api/auth/logout");
    response = await response.json();
    if (response) {
      router.replace("/login");
    }
  };

  return (
    <Layout>
      <Affix offsetTop={0}>
        <div className="header">
          <Menu theme="light" mode="horizontal" className="menu">
            <Image src={logo} width={70} height={70} alt="logo" />
            <Item key={0}>
              <Link href="/">Home</Link>
            </Item>
            <SubMenu key="sub1" title={<span>Machines</span>}>
              <Item key={1}>
                <Link href="/machines/carpentry">Carpentry Lab</Link>
              </Item>
              <Item key={2}>
                <Link href="/machines/electronics">Electronic Lab</Link>
              </Item>
              <Item key={3}>
                <Link href="/machines/heavymachines">Heavy Machine Lab</Link>
              </Item>
              <Item key={4}>
                <Link href="/machines/metalworks">Laser Lab</Link>
              </Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span>Programs</span>}>
              <Item key={5}>
                <Link href="/programs/education">Education Program</Link>
              </Item>
              <Item key={6}>
                <Link href="/programs/training">Training Program</Link>
              </Item>
              <Item key={7}>
                <Link href="/programs/research">Research And Development</Link>
              </Item>
            </SubMenu>
            <Item key={8}>
              <Link href="/service">Service</Link>
            </Item>
            <Item key={9}>
              <Link href="/news">News And Events</Link>
            </Item>
            <SubMenu key="sub3" title={<span>About Us</span>}>
              <Item key={10}>
                <Link href="/aboutus">Story of SFL</Link>
              </Item>
              <Item key={11}>
                <Link href="/aboutus/team">Meet the Team</Link>
              </Item>
              <Item key={12}>
                <Link href="/aboutus/virtualtour">Virtual Tour</Link>
              </Item>
              <Item key={13}>
                <Link href="/aboutus/gallery">Gallery</Link>
              </Item>
            </SubMenu>
            {/* show diff for login state */}
            {login_state ? (
              <SubMenu
                key="sub4"
                title={
                  <>
                    <UserOutlined />
                    <span>{role}</span>
                  </>
                }
              >
                <Item key={14}>
                  <Link href="/profile">Profile</Link>
                </Item>
                <Item key={15}>
                  <Link href="/booking">Booking</Link>
                </Item>
                <Item key={16}>
                  <Button
                    type="link"
                    onClick={() => {
                      Logout();
                    }}
                  >
                    Logout
                  </Button>
                </Item>
              </SubMenu>
            ) : (
              <Item key={17}>
                <Link href="/login" passHref>
                  <Button style={{ borderRadius: "20px" }}>Login</Button>
                </Link>
              </Item>
            )}
          </Menu>
        </div>
      </Affix>

      <Content>{children}</Content>
    </Layout>
  );
}
