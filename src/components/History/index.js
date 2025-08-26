import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../Header"

const HistoryPage = () => {
  const location = useLocation()
  const { username, user } = location.state || {}

  const [outpassData, setOutpassData] = useState([])
  const [studentOutpassData, setStudentOutpassData] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch data
  useEffect(() => {
    const apiUrl =
      user === "student"
        ? `http://localhost:3000/history/${username}`
        : "http://localhost:3000/history"

    setLoading(true)
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok")
        return response.json()
      })
      .then((data) => {
        if (user === "student") setStudentOutpassData(data)
        else setOutpassData(data)
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false))
  }, [user, username])

  // 🔹 Update outpass status helper
  const updateOutpassStatus = (id, status) => {
    if (user === "staff" || user === "hod") {
      setOutpassData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      )
    } else {
      setStudentOutpassData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      )
    }
  }

  // 🔹 Staff actions
  const handleStaffAccept = (id) => {
    axios
      .post(
        `http://localhost:3000/outpass/${id}/staff-approve`
      )
      .then((res) => {
        if (res.data.success) {
          updateOutpassStatus(id, "Staff Approved")
          alert(`Accepted outpass with ID: ${id}`)
        } else {
          alert(`Failed to accept outpass with ID: ${id}`)
        }
      })
      .catch((err) => console.error("Error accepting outpass:", err))
  }

  const handleStaffDecline = (id) => {
    axios
      .post(
        `http://localhost:3000/outpass/${id}/staff-decline`
      )
      .then((res) => {
        if (res.data.success) {
          updateOutpassStatus(id, "Staff Declined")
          alert(`Declined outpass with ID: ${id}`)
        }
      })
      .catch((err) => console.error("Error declining outpass:", err))
  }

  // 🔹 HOD actions
  const handleAccept = (id) => {
    setLoading(true)
    axios
      .post(`http://localhost:3000/outpass/${id}/accept`)
      .then((res) => {
        if (res.data.success) {
          updateOutpassStatus(id, "HOD Accepted")
          alert(`Accepted outpass with ID: ${id}`)
        }
      })
      .catch((err) => console.error("Error accepting outpass:", err))
      .finally(() => setLoading(false))
  }

  const handleDecline = (id) => {
    if (window.confirm("Are you sure you want to decline this outpass?")) {
      axios
        .post(
          `http://localhost:3000/outpass/${id}/decline`
        )
        .then((res) => {
          if (res.data.success) {
            updateOutpassStatus(id, "HOD Declined")
            alert(`Declined outpass with ID: ${id}`)
          }
        })
        .catch((err) => console.error("Error declining outpass:", err))
    }
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Header username={username} user={user} />

        {loading ? (
          <div className="col p-0 m-0 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="col p-0 m-0">
            <div className="p-2 d-flex justify-content-center flex-column shadow">
              <h4 className="text-center">History</h4>
              <div className="container">
                {user === "staff" || user === "hod" ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                    {outpassData.map((item) => (
                      <div key={item.id} className="col mb-4">
                        <div className="card">
                          <div className="card-body">
                            <h3 className="card-title">{item.name}</h3>
                            <p>Register No: {item.registernumber}</p>
                            <p>Email: {item.email}</p>
                            <p>Department: {item.department}</p>
                            <p>Year: {item.year}</p>
                            <p>Semester: {item.semester}</p>
                            <p>Requested Time: {item.current_datetime}</p>
                            <p>Reason: {item.reason}</p>
                            <p>Status: {item.status}</p>

                            {user === "staff" && (
                              <>
                                <button
                                  onClick={() => handleStaffAccept(item.id)}
                                  className="btn btn-success mr-2"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleStaffDecline(item.id)}
                                  className="btn btn-danger m-3"
                                >
                                  Decline
                                </button>
                              </>
                            )}

                            {user === "hod" && (
                              <>
                                <button
                                  onClick={() => handleAccept(item.id)}
                                  className="btn btn-success mr-2"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDecline(item.id)}
                                  className="btn btn-danger m-3"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                    {studentOutpassData.map((item) => (
                      <div key={item.id} className="col mb-4">
                        <div className="card">
                          <div className="card-body">
                            <h3 className="card-title">{item.name}</h3>
                            <p>Register No: {item.registernumber}</p>
                            <p>Email: {item.email}</p>
                            <p>Department: {item.department}</p>
                            <p>Year: {item.year}</p>
                            <p>Semester: {item.semester}</p>
                            <p>Requested Time: {item.current_datetime}</p>
                            <p>Reason: {item.reason}</p>
                            <p>Status: {item.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
