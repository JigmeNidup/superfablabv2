import Head from "next/head";
import Image from "next/image";

import Header from "../components/header";
import { verify } from "jsonwebtoken";
import { Card, Carousel, Col, Row } from "antd";
import logo from "../public/assets/img/logo.png";
import Link from "next/link";

import styles from "../styles/Home.module.css";

const { Meta } = Card;

const server = process.env.SERVER;
const secreteKEY = process.env.JWT_KEY;
const public_serv = process.env.NEXT_PUBLIC_SERVER;

export async function getServerSideProps({ req }) {
  //program titles and description
  let education = await fetch(server + "/education-program");
  education = await education.json();
  education.description =
    "Education programs are developed to equip the next generation with the necessary skills and knowledge in the field of technology and digital fabrication.";

  let training = await fetch(server + "/training-program");
  training = await training.json();
  training.description =
    "SFL will offer trainings, workshops, and seminars, all focused on professional development, and building the skills and capacity for digital designing and fabrication.";

  let research = await fetch(server + "/research-program");
  research = await research.json();
  research.description =
    "There is a huge potential for enabling research through the SFL platform. The lab currently enables innovation, invention, and prototyping. To foster a culture of learning, applicable and sustainable in-house research is encouraged. SFL is also open to collaborations with like-minded organizations and individuals.";
  let Programs = {
    education,
    training,
    research,
  };
  // .......

  // Machines
  let carpentry = await fetch(server + "/machines/carpentry");
  carpentry = await carpentry.json();

  let electronic = await fetch(server + "/machines/electronic");
  electronic = await electronic.json();

  let heavymachine = await fetch(server + "/machines/heavy-machinary");
  heavymachine = await heavymachine.json();

  let metalwork = await fetch(server + "/machines/metal-works");
  metalwork = await metalwork.json();

  let Machines = {
    carpentry,
    electronic,
    heavymachine,
    metalwork,
  };
  // .......

  // News and Events
  let News = await fetch(server + "/news-and-events");
  News = await News.json();
  News = News.news[0];
  // .......

  const jwt = req.cookies.jwt;

  let users = null;
  let isLoggedIn;
  try {
    users = verify(jwt, secreteKEY);
    isLoggedIn = true;
  } catch (error) {
    isLoggedIn = false;
  }

  return {
    props: { Programs, Machines, News, users, isLoggedIn },
  };
}

export default function Home({ isLoggedIn, users, Programs, Machines, News }) {
  // Card for Learn Section
  const LearnCard = ({ title, type, image, description, program }) => {
    return (
      <Col
        style={{
          marginBottom: "10px",
        }}
      >
        <Card
          hoverable
          style={{
            width: "330px",
            height: "550px",
            borderRadius: "20px",
          }}
          cover={
            <Image
              height={200}
              width={330}
              style={{
                borderRadius: "20px",
              }}
              alt={type}
              src={image}
              // src={"/assets/img/home/printer1.jpg"}
            />
          }
        >
          <Meta
            title={title}
            description={
              <p className="smtext">
                {description}
                <br /> Here are some of our programs:
                {
                  <ul>
                    {program.map((val, i) => {
                      if (i < 5) {
                        //limits no of title shown to home page to 4 titles
                        return (
                          <li className="smtext" key={i}>
                            {val.title}
                          </li>
                        );
                      }
                    })}
                  </ul>
                }
                <Link href={"/programs/" + type} passHref>
                  <button
                    className="button"
                    style={{ position: "absolute", bottom: "5px" }}
                  >
                    Read More
                  </button>
                </Link>
              </p>
            }
          />
        </Card>
      </Col>
    );
  };

  // Carousel Card
  const CarouselCard = ({ title, type, Data }) => {
    if (Data[0] === undefined) {
      return;
    } else {
      let random = Math.floor(Math.random() * Data.length);
      let equipmentName = Data[random].equipmentName;
      let description = Data[random].description;
      let image = Data[random].image;
      return (
        <Card
          style={{
            borderRadius: "30px",
            // backgroundColor:"blue"
          }}
        >
          <Row justify="space-around">
            <Col
              style={{
                maxWidth: "350px",
                // minHeight: "390px",
              }}
            >
              <p className="title">{title}</p>
              <p className="subtitle">{equipmentName}</p>
              <p className="smtext">{description}</p>
              <Link href={"/machines/" + type} passHref>
                <button className="button">Read More</button>
              </Link>
            </Col>
            <Col>
              <Image
                width={320}
                height={300}
                src={public_serv + "/" + image}
                alt={type}
              />
            </Col>
          </Row>
        </Card>
      );
    }
  };
  return (
    <Header isLoggedIn={isLoggedIn} users={users}>
      <Head>
        <title>Super Fab Lab Bhutan</title>
        <meta name="description" content="Super Fab Lab Bhutan" />
        <link rel="icon" href="/assets/img/logo.png" />
      </Head>

      <main>
        <div className={styles.video_wrapper}>
          <video height="100%" width="100%" playsInline autoPlay loop muted>
            <source src="/assets/video/3d.mp4" type="video/mp4" />
          </video>
          <div
            style={{
              position: "relative",
            }}
          >
            <Row justify="space-evenly">
              <Col span={24}>
                <Image height={140} width={140} src={logo} alt="sfl logo" />
              </Col>
              <Col style={{ color: "white" }} span={24}>
                <p className="title">Welcome To Super FabLab</p>
                <p>
                  Inspire the future of learning and creating. Provide digital
                  design tools to ignite a culture of innovation.
                </p>
                <Link href="/register" passHref>
                  <button className="button" style={{ color: "white" }}>
                    Join Us Today
                  </button>
                </Link>
              </Col>
            </Row>
          </div>
        </div>
        <br />
        <div className="center">
          <b className="title">About Us</b>
          <br />
          <Card
            hoverable
            style={{
              borderRadius: "30px",
              margin: "auto",
              maxWidth: "90%",
            }}
          >
            <Row justify="space-evenly">
              <Col>
                <Image height={250} width={250} src={logo} alt="sfl logo" />
              </Col>
              <Col
                style={{
                  maxWidth: "60%",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1.5rem", textAlign: "center" }}>
                    Vision
                  </h4>
                  <p
                    style={{
                      color: "black",
                      textAlign: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    “Inspire the future of learning and creating”
                  </p>
                  <h4 style={{ fontSize: "1.5rem", textAlign: "center" }}>
                    Mission
                  </h4>
                  <p
                    style={{
                      color: "black",
                      textAlign: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    “Provide digital design tools to ignite a culture of
                    innovation”
                  </p>
                  <hr />
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "1rem",
                      color: "black",
                      fontWeight: "normal",
                      fontFamily: "bell",
                    }}
                  >
                    The Bhutan Super FabLab is an open platform for learning and
                    innovation; a place to play, learn, mentor, collaborate, and
                    create.Located at Thimphu Tech Park, it is the 2nd Super Fab
                    Lab in the world, providing unique digital fabrication tools
                    and services to its community.It currently consists of four
                    different labs - focused on metalwork, carpentry,
                    electronics production, and industrial graded work.Join us
                    in our journey to learn and create almost anything.
                  </h6>
                </div>
              </Col>
            </Row>
          </Card>

          <b className="title">Learn</b>
          <p className="subtitle">To Make Almost Anything</p>
          <Row justify="space-evenly">
            <LearnCard
              title="Education"
              type="education"
              image="/assets/img/home/printer1.jpg"
              description={Programs.education.description}
              program={Programs.education.program}
            />
            <LearnCard
              title="Training"
              type="training"
              image="/assets/img/home/laser.jpg"
              description={Programs.training.description}
              program={Programs.training.program}
            />
            <LearnCard
              title="Research"
              type="research"
              image="/assets/img/home/molding.jpg"
              description={Programs.research.description}
              program={Programs.research.program}
            />
          </Row>
          <br />

          <b className="title">Create</b>
          <p className="subtitle">
            Through Digital Tools And Open Community Ecosystem
          </p>
        </div>
        {/* machine carousel */}
        <div
          style={{
            borderRadius: "30px",
            maxWidth: "850px",
            margin: "auto",
          }}
        >
          <Carousel style={{ padding: "10px" }} autoplay>
            <CarouselCard
              title="Carpentry Lab"
              type="carpentry"
              Data={Machines.carpentry.equipment}
            />
            <CarouselCard
              title="Electronic Lab"
              type="electronics"
              Data={Machines.electronic.equipment}
            />
            <CarouselCard
              title="Heavy Machines Lab"
              type="heavymachines"
              Data={Machines.heavymachine.equipment}
            />
            <CarouselCard
              title="Laser Lab"
              type="metalworks"
              Data={Machines.metalwork.equipment}
            />
          </Carousel>
        </div>
        <div className="center">
          <b className="title">Collaborate</b>
          <p className="subtitle">In An Innovative Space</p>
        </div>
        <div>
          <Row justify="space-evenly">
            <Col style={{ borderRadius: "30px" }}>
              <Card
                hoverable
                title={
                  <b
                    style={{
                      fontSize: "20px",
                      textAlign: "right",
                      color: "gray",
                    }}
                  >
                    Work With us as a volunter
                  </b>
                }
                className={styles.col_container}
              >
                <div className={styles.col_image}>
                  <Image
                    height={300}
                    width={300}
                    style={{ borderRadius: "30px" }}
                    src="/assets/img/home/b3.jpg"
                    alt="err"
                  />
                </div>
                {/* <b
                  style={{
                    position: "absolute",
                    fontSize: "20px",
                    top: "10%",
                    right: "5%",
                    textAlign: "right",
                    color: "gray",
                  }}
                >
                  Work With us as a volunter
                </b> */}
                <div className={styles.col_text}>
                  <p>
                    Get a chance to become a part of SFL and get work
                    experience.It&apos;s an opportunity to get free access to
                    the facilities provided by SFL.
                  </p>
                </div>
              </Card>
            </Col>
            <Col style={{ borderRadius: "30px" }}>
              <Card hoverable title={
                  <b
                    style={{
                      fontSize: "20px",
                      textAlign: "right",
                      color: "gray",
                    }}
                  >
                  Apply For Internship</b>
                } className={styles.col_container}>
                <div className={styles.col_image}>
                  <Image
                    height={300}
                    width={300}
                    style={{ borderRadius: "30px" }}
                    src="/assets/img/home/b5.jpg"
                    alt="err"
                  />
                </div>
                {/* <b
                  style={{
                    position: "absolute",
                    fontSize: "20px",
                    top: "10%",
                    right: "5%",
                    textAlign: "right",
                    color: "gray",
                  }}
                >
                  Apply For Internship
                </b> */}
                <div className={styles.col_text}>
                  <p>
                    SFL is a great place to learn and get exposure.You will be
                    able to do research and projects with our staff and even our
                    collaborators.
                  </p>
                </div>
              </Card>
            </Col>
            <Col style={{ borderRadius: "30px" }}>
              <Card hoverable title={
                  <b
                    style={{
                      fontSize: "20px",
                      textAlign: "right",
                      color: "gray",
                    }}
                  >
                  Become a Member
                </b>
                } className={styles.col_container}>
                <div className={styles.col_image}>
                  <Image
                    height={300}
                    width={300}
                    style={{ borderRadius: "30px" }}
                    src="/assets/img/home/sensor.jpg"
                    alt="err"
                  />
                </div>
                {/* <b
                  style={{
                    position: "absolute",
                    fontSize: "20px",
                    top: "10%",
                    right: "5%",
                    textAlign: "right",
                    color: "gray",
                  }}
                >
                  Become a Member
                </b> */}
                <div className={styles.col_text}>
                  <p>
                    We have great membership plans :
                    <br />
                    SFL Youth
                    <br />
                    SFL Community
                    <br />
                    SFL creator
                    <br />
                    SFl Business
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="center">
          <b className="title">Vist Us</b>
          <Card
            hoverable
            style={{
              minHeight: "300px",
              minWidth: "340px",
              maxWidth: "550px",
              borderRadius: "30px",
              display: "grid",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Image
              width={90}
              height={90}
              src={"/assets/img/home/clock.png"}
              alt="clock"
            />
            <h3
              style={{ color: "black", fontFamily: "bell", fontSize: "2rem" }}
            >
              When
            </h3>
            <p style={{ color: "grey", fontSize: "1.1rem" }}>
              Monday to Friday: 9:00 AM -6:00 PM
              <br />
              Saturday and Sunday:
              <br /> Open hours you can walk in anytime for a lab visit. You can
              also book a schedule to use a specific machine at a suitable time.
            </p>
          </Card>
          <br />
          <b className="title">News And Events</b>
        </div>

        <Card
          style={{
            backgroundImage: `url(${public_serv + "/" + News.image})`,

            backgroundSize: "cover",
            opacity: "0.8",
            minHeight: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
            marginBottom: "50px",
            // color: "white",
            textAlign: "center",
          }}
        >
          <b className="title">{News.title}</b>
          <p>{News.description.slice(0, 200) + "..."}</p>
          <Link href="/news" passHref>
            <button className="button">Update More</button>
          </Link>
        </Card>
      </main>
    </Header>
  );
}
