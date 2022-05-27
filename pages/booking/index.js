import { Card, Checkbox, Col, DatePicker, Modal, Radio, Row, Tabs } from "antd";
import styles from "../../styles/Booking.module.css";

import Header from "../../components/header";

import { verify } from "jsonwebtoken";
import { useState } from "react";
import Link from "next/link";
const secreteKEY = process.env.JWT_KEY; //server side
const server = process.env.NEXT_PUBLIC_SERVER; //client side

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
    return {
      redirect: {
        //redirects if cookie is invalid
        permanent: false,
        destination: "/login",
      },
    };
  }

  let DD = new Date();
  let newdate = `${DD.getFullYear()}-${DD.getMonth()}-${DD.getDate()}`;
  //get initial booking
  let initialData = [];
  try {
    let data = await fetch(server + "/user/Bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newdate, role: users.role }),
    });
    data = await data.json();
    initialData = data;
  } catch (error) {}

  return {
    props: {
      users,
      isLoggedIn,
      initialData,
    },
  };
}

const { TabPane } = Tabs;

export default function Booking({ initialData, isLoggedIn, users }) {
  const equipmentTypeOptions = ["Carpentry", "Electronic", "Heavy", "Metal"];

  const [Data, setData] = useState(initialData);
  const [date, setDate] = useState(new Date());

  //calls api to update booking
  const GetBookings = async () => {
    try {
      await fetch(server + "/user/Bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date,
          role: users.role,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setData(data);
        });
    } catch (error) {}
  };

  //...Modal
  const [showModalView, setModalView] = useState(false);
  // .....

  // send booking
  async function sendData(EquipmentId, date, time) {
    try {
      const res = await fetch(server + "/user/addBooking", {
        method: "POST",
        body: JSON.stringify({
          userID: users.id,
          date: date,
          EquipmentId: EquipmentId,
          time: time,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      alert(data.message);
      GetBookings(); //refresh data
    } catch (err) {
      console.log(err);
    }
  }
  // const holidays = [new Date(2022, 4, 3), new Date(2023, 0, 11)];

  const handleClick = (event) => {
    var data = event.target.dataset.value;
    var time = data.split(" ")[0];
    var EquipmentId = data.split(" ")[1];
    if (confirm(`are you sure you want to book on ${date} from ${time}`)) {
      sendData(EquipmentId, date, time);
    }
  };

  const BookingTable = ({ TableData }) => {
    return (
      <div style={{ overflowX: "auto" }}>
        <table border="1px" cellSpacing="0">
          <thead cellPadding="5px">
            <tr>
              <th style={{ width: "250px" }}>Equipments</th>
              <th>9:30-10:30</th>
              <th>10:30-11:30</th>
              <th>11:30-12:30</th>
              <th>1:30-2:30</th>
              <th>2:30-3:30</th>
              <th>3:30-4:30</th>
              <th>4:30-5:30</th>
              <th>5:30-6:30</th>
            </tr>
          </thead>
          <tbody>
            {TableData.map((val, i) => {
              if (val.EquipmentName.search("3d") == -1) {
                return (
                  <tr key={i}>
                    <th>{val.EquipmentName}</th>
                    {val.Booking.map((items, j) => {
                      return (
                        <td
                          key={j}
                          className={
                            items.booked ? styles.booked : styles.unbooked
                          }
                          onClick={handleClick}
                          data-value={items.time + " " + val.EquipmentId}
                        ></td>
                      );
                    })}
                  </tr>
                );
              } else {
                return (
                  <tr key={i}>
                    <th>{val.EquipmentName}</th>
                    <td
                      colSpan="3"
                      className={styles.unbooked}
                      onClick={handleClick}
                      data-value={"09:30-12:30" + " " + val.EquipmentId}
                    ></td>
                    <td
                      colSpan="5"
                      className={styles.unbooked}
                      onClick={handleClick}
                      data-value={"01:30-06:30" + " " + val.EquipmentId}
                    ></td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const [InductionDay, setInductionDay] = useState();
  const [InductionDate, setInductionDate] = useState();
  const [showInductionDate, setShowInductionDate] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);

  const BookInduction = async () => {
    try {
      let response = await fetch(server + "/user/bookingInduction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: InductionDate, userID: users.id }),
      });
      response = await response.json();
      if (response.value === "true") {
        alert(response.message);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const InductionForm = () => {
    return (
      <Card bordered={false} title="Induction Training Form">
        <p>
          Induction training is only on Thursday and Friday(3:00pm - 5:00pm)
        </p>
        <span>Select Day:</span>
        <br />
        <Radio.Group
          value={InductionDay}
          onChange={(e) => {
            setInductionDay(e.target.value);
            setShowInductionDate(true);
          }}
        >
          <Radio value="Thursday">Thursday</Radio>
          <Radio value="Friday">Friday</Radio>
        </Radio.Group>
        <br />
        <br />
        {showInductionDate ? (
          <>
            <DatePicker
              // defaultValue={InductionDate}
              placement="bottomLeft"
              // disabledDate={(e) => {
              //   return e;
              // }}
              onChange={(e, val) => {
                setInductionDate(val);
              }}
            />{"   "}{InductionDate}
            <br />
            <br />
            <Checkbox
              checked={checkTerms}
              onChange={(e) => {
                setCheckTerms(e.target.checked);
              }}
            >
              I have read and agreed to the{" "}
              <Link
                href={
                  server +
                  "/" +
                  "uploads/files/1653046420611-SP400-flexx_8027_Operationmanual_EN.pdf"
                }
              >
                Terms and Conditions
              </Link>{" "}
              of SFL
            </Checkbox>
            <br />
            <br />
            {checkTerms ? (
              <button
                className="button"
                onClick={() => {
                  BookInduction();
                }}
                style={{ width: 150 }}
              >
                Submit
              </button>
            ) : null}
          </>
        ) : null}
      </Card>
    );
  };

  return (
    <Header isLoggedIn={isLoggedIn} users={users}>
      <main>
        <p className="title">Booking</p>
        <Row gutter={[16, 16]} justify="space-evenly">
          <Col>
            <div style={{ padding: "10px" }}>
              Date:{" "}
              <DatePicker
                onChange={(x, val) => {
                  setDate(val);
                  GetBookings();
                }}
              />
              <br />
              <br />
              <button
                className="button"
                onClick={() => {
                  setModalView(true);
                }}
              >
                Enroll For Induction Training
              </button>
            </div>
          </Col>
          <Col>
            {/* Select Machine Labs:
            <br /> */}
            <Tabs tabPosition="top">
              {equipmentTypeOptions.map((val, i) => {
                let EquipmentData = Data.filter((data) => {
                  return data.Type == val;
                });

                return (
                  <TabPane tab={val} key={i}>
                    <BookingTable TableData={EquipmentData} />
                  </TabPane>
                );
              })}
            </Tabs>
          </Col>
        </Row>
        <Modal
          visible={showModalView}
          footer={null}
          onCancel={() => {
            setModalView(false);
          }}
          width={500}
        >
          <InductionForm />
        </Modal>
        <br />
      </main>
    </Header>
  );
}
