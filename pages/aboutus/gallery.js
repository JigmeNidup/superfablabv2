import { Card, Row, Col } from "antd";
import Image from "next/image";
import Header from "../../components/header";
import { verify } from "jsonwebtoken";
const secreteKEY = process.env.JWT_KEY;
const public_serv = process.env.NEXT_PUBLIC_SERVER;
export async function getServerSideProps({ req }) {
  // check for login
  const jwt = req.cookies.jwt;

  let users = null;
  let isLoggedIn;
  try {
    users = verify(jwt, secreteKEY);
    isLoggedIn = true;
  } catch (error) {
    isLoggedIn = false;
  }

  //get gallery image
  let galleryData = await fetch(public_serv + "/getimages");
  galleryData = await galleryData.json();

  return {
    props: {
      galleryData,
      users,
      isLoggedIn,
    },
  };
}

export default function gallery({ galleryData, isLoggedIn, users }) {
  const GalleryData = galleryData.gallery;
  return (
    <Header isLoggedIn={isLoggedIn} users={users}>
      <main>
        <p className="title">Collection Pictures of SFL</p>
        <Row gutter={[16, 16]} justify="space-evenly">
          {GalleryData.map((val, i) => {
            return (
              <Col key={i}>
                <Card
                  style={{
                    width: "300px",
                    height: "260px",
                  }}
                >
                  <Image
                    src={public_serv + "/" + val.image}
                    layout="fill"
                    alt="gallery image"
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
        <br />
      </main>
    </Header>
  );
}
