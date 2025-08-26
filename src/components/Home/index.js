import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import Header from "../Header"

const OutpassForm = () => {
  const location = useLocation()
  const { username, user } = location.state || {}

  const [formData, setFormData] = useState({
    registerNo: "",
    name: "",
    email: "",
    year: "",
    department: "",
    semester: "",
    reason: "",
  })

  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log(formData.registerno)
      const res = await axios.post(
        "http://localhost:3000/outpass",
        formData
      )

      if (res.data.submission) {
        setFormData({
          registerNo: "",
          name: "",
          email: "",
          year: "",
          department: "",
          semester: "",
          reason: "",
        })
        setErrorMsg("")
        alert("✅ Outpass Submitted Successfully")
      } else {
        setErrorMsg(res.data.Error || "Submission failed")
      }
    } catch {
      setErrorMsg("Server error, please try again later.")
    }
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Header username={username} user={user} />
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Outpass Management System</h4>
          </div>

          <form className="row p-3 g-3" onSubmit={onSubmit}>
            {/* Register No */}
            <div className="col-md-6">
              <label className="form-label">Register No</label>
              <input
                type="text"
                value={formData.registerNo}
                onChange={handleChange("registerNo")}
                className="form-control"
                required
              />
            </div>

            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                className="form-control"
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                className="form-control"
                required
              />
            </div>

            {/* Year */}
            <div className="col-md-6">
              <label className="form-label">Year</label>
              <select
                value={formData.year}
                onChange={handleChange("year")}
                className="form-select"
                required
              >
                <option value="">Select</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
                <option>V</option>
              </select>
            </div>

            {/* Semester */}
            <div className="col-md-4">
              <label className="form-label">Semester</label>
              <select
                value={formData.semester}
                onChange={handleChange("semester")}
                className="form-select"
                required
              >
                <option value="">Select</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
                <option>V</option>
                <option>VI</option>
                <option>VII</option>
                <option>VIII</option>
                <option>IX</option>
                <option>X</option>
              </select>
            </div>

            {/* Department */}
            <div className="col-md-4">
              <label className="form-label">Department</label>
              <select
                value={formData.department}
                onChange={handleChange("department")}
                className="form-select"
                required
              >
                <option value="">Select</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>EEE</option>
                <option>MECH</option>
                <option>AI</option>
                <option>IOT</option>
                <option>CYS</option>
              </select>
            </div>

            {/* Reason */}
            <div className="col-12">
              <label className="form-label">Reason</label>
              <textarea
                value={formData.reason}
                onChange={handleChange("reason")}
                className="form-control"
                placeholder="Enter Valid Reason"
                rows="3"
                required
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="col-12 text-danger fw-bold">{errorMsg}</div>
            )}

            {/* Submit */}
            <div className="col-12 d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">
                Request Outpass
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OutpassForm
