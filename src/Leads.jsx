import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Card, Dropdown } from "react-bootstrap";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { BiPhoneCall } from "react-icons/bi";
import { IoPersonAdd } from "react-icons/io5";

const Leads = () => {
  const baseUrl = "https://authbackend-uoeq.onrender.com";
  const [leads, setLeads] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    email_id: "",
    phone_number: "",
  });
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    email_id: "",
    phone_number: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/leads`);
      setLeads(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.error("Error fetching leads:", error);
      setLoading(false);
    }
  };

  const handleSort = (order) => {
    const sortedLeads = [...leads].sort((a, b) => {
      if (a.name < b.name) return order === "asc" ? -1 : 1;
      if (a.name > b.name) return order === "asc" ? 1 : -1;
      return 0;
    });
    setLeads(sortedLeads);
    setSortOrder(order);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleNewLeadChange = (e) => {
    const { name, value } = e.target;
    setNewLeadForm({ ...newLeadForm, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${baseUrl}/leads/${editForm.email_id}`, editForm);
      fetchLeads();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };
  const [error, setError] = useState(null);
  const handleCreateSubmit = async () => {
    try {
      const res = await axios.post(`${baseUrl}/leads`, newLeadForm);
      console.log(res.response.data.message);
      if (res.response.data.status === 0) {
        setError(res.response.data.message);
      } else {
        setError("");
      }
      fetchLeads();
      setShowCreateModal(false);
      setNewLeadForm({ name: "", email_id: "", phone_number: "" });
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete(`${baseUrl}/leads/${email}`);
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const openEditModal = (lead) => {
    setSelectedLead(lead);
    setEditForm(lead);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditForm({ name: "", email_id: "", phone_number: "" });
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewLeadForm({ name: "", email_id: "", phone_number: "" });
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="d-flex justify-content-center">
      <div className="m-5 w-100 h-100 list-wrapper py-3 px-5 ">
        <p className="fs-3 fw-bold">Leads</p>
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <div className="d-flex search-input-wrapper align-items-center">
                <span className="search-icon me-2">
                  <CiSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={filter}
                  onChange={handleFilter}
                  className="w-100"
                />
              </div>
            </div>
            <div className="col-6 col-md-3 mb-2 mb-md-0">
              <Dropdown className="w-100">
                <Dropdown.Toggle
                  style={{ backgroundColor: "#9052ae", borderColor: "#9052ae" }}
                  id="dropdown-basic"
                >
                  Sort by
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSort("asc")}>
                    Sort by Name A-Z
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort("desc")}>
                    Sort by Name Z-A
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-6 col-md-3 text-center">
              <div
                className="btn btn-primary"
                style={{ backgroundColor: "#9052ae", borderColor: "#9052ae" }}
                onClick={openCreateModal}
              >
                Add +
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {!loading ? (
            <div className="row d-flex justify-content-center">
              {filteredLeads.map((lead) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  <Card body className="m-2">
                    <div className="d-flex align-items-center justify-content-start mb-2">
                      <div className="initial">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="fw-bold ms-2">{lead.name}</div>
                    </div>
                    <div className="d-flex align-items-center justify-content-start mb-1">
                      <div className="me-2">
                        <MdEmail />
                      </div>
                      <div className="overflow-x-auto">{lead.email_id}</div>
                    </div>
                    <div className="d-flex align-items-center justify-content-start mb-1">
                      <div className="me-2">
                        <BiPhoneCall />
                      </div>
                      <div>{lead.phone_number}</div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center my-2">
                      <Button
                        variant="warning"
                        className="m-1"
                        onClick={() => openEditModal(lead)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="m-1"
                        onClick={() => handleDelete(lead.email_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-grow text-secondary loader" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-secondary loader" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-secondary loader" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={closeEditModal} centered>
          <Modal.Header closeButton className="custom-modal-header">
            Edit Lead
          </Modal.Header>
          <div className="d-flex flex-column justify-content-center align-items-center editbox-header">
            <div className="editbox-letter mt-2">
              {editForm.name.charAt(0).toUpperCase()}
            </div>
            <div className="fw-bold mt-1">{editForm.name}</div>
          </div>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="my-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email_id"
                  value={editForm.email_id}
                  onChange={handleEditChange}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="formPhoneNumber" className="my-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  name="phone_number"
                  value={editForm.phone_number}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleEditSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Create Modal */}
        <Modal show={showCreateModal} onHide={closeCreateModal}>
          <Modal.Header closeButton className="custom-modal-header">
            Create New Lead
          </Modal.Header>
          <div className="d-flex flex-column justify-content-center align-items-center editbox-header">
            <div className="editbox-letter my-2">
              <IoPersonAdd />
            </div>
          </div>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNewName" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={newLeadForm.name}
                  onChange={handleNewLeadChange}
                />
              </Form.Group>
              <Form.Group controlId="formNewEmail" className="my-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email_id"
                  value={newLeadForm.email_id}
                  onChange={handleNewLeadChange}
                />
              </Form.Group>
              {error && <div className="text-danger">{error}</div>}
              <Form.Group controlId="formNewPhoneNumber" className="my-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  name="phone_number"
                  value={newLeadForm.phone_number}
                  onChange={handleNewLeadChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSubmit}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Leads;
