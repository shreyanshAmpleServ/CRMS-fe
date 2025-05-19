import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ImageWithBasePath from '../../components/common/imageWithBasePath';
import ImageWithDatabase from '../../components/common/ImageFromDatabase';
import AddContactModal from './modal/AddContactModal';

const ContactGrid = ({ data }) => {
    const [selectedContact ,setSelectedContact] = useState()
    const route = all_routes;
    return (
        <>
            <div className="row">
                
                {data.map((contact, index) => (
                    <div className="col-xxl-3 col-xl-4 col-md-6" key={contact.id || index}>
                        <div className="card border">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <Link
                                            to={contact.contactDetails || '#'}
                                            className="avatar avatar-md flex-shrink-0 me-2"
                                        >
                                            <ImageWithDatabase
                                                src={contact.image || 'assets/img/profiles/default-avatar.jpg'}
                                                alt="img"
                                            />
                                        </Link>
                                        <div>
                                            <h6>
                                                <Link
                                                    to={contact.contactDetails || '#'}
                                                    className="fw-large h5"
                                                >
                                                    {`${contact.firstName || ''} ${contact.lastName || ''}`}
                                                </Link>
                                            </h6>
                                            <p style={{lineHeight:"1.2"}} className="text-default">
                                               <div> {contact.jobTitle || 'N/A'}</div>
                                              <span style={{fontWeight:500}} > ({contact.company_details?.name || 'N/A'}) </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="dropdown table-action">
                                        <Link
                                            to="#"
                                            className="action-icon"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="fa fa-ellipsis-v" />
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                             <Link
                                                          className="dropdown-item edit-popup"
                                                          to="#"
                                                          data-bs-toggle="offcanvas"
                                                          data-bs-target="#offcanvas_add"
                                                          onClick={() => setSelectedContact(contact)} // Set selected contact
                                                        >
                                                          <i className="ti ti-edit text-blue"></i> Edit
                                                        </Link>
                                            <Link
                                                className="dropdown-item"
                                                to="#"
                                                data-bs-toggle="modal"
                                                data-bs-target="#delete_contact"
                                            >
                                                <i className="ti ti-trash text-danger" /> Delete
                                            </Link>
                                            <Link
                                                className="dropdown-item"
                                                to={contact.contactDetails || '#'}
                                            >
                                                <i className="ti ti-eye text-blue-light" /> Preview
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-block">
                                    <div className="d-flex flex-column mb-3">
                                        <p className="text-default d-inline-flex align-items-center mb-2">
                                            <i className="ti ti-mail text-dark me-1" />
                                            {contact.email || 'No Email'}
                                        </p>
                                        <p className="text-default d-inline-flex align-items-center mb-2">
                                            <i className="ti ti-phone text-dark me-1" />
                                            {contact.phone1 || 'No Phone'}
                                        </p>
                                        <p className="text-default d-inline-flex align-items-center">
                                            <i className="ti ti-map-pin-pin text-dark me-1" />
                                            {`${contact.city || ''}, ${contact.country || ''}`}
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {contact.tags && contact.tags.split(',').map((tag, i) => (
                                            <span key={i} className="badge badge-tag badge-success-light me-2">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <div className="d-flex align-items-center grid-social-links">
                                        {Object.entries(contact.socialProfiles || {}).map(([key, value], i) => (
                                            value && (
                                                <Link
                                                    to={value}
                                                    key={i}
                                                    className="avatar avatar-xs text-dark rounded-circle me-1"
                                                >
                                                    <i className={`ti ti-brand-${key} fs-14`} />
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="set-star text-default d-flex me-2">
                                            <i className="fa fa-star filled me-1" />
                                            {contact.reviews || 'N/A'}
                                        </div>
                                        <Link
                                            to="#"
                                            className="avatar avatar-md"
                                            data-bs-toggle="tooltip"
                                            data-bs-original-title={contact.owner_details?.full_name || 'Owner'}
                                            data-bs-placement="top"
                                        >
                                            <ImageWithDatabase
                                                src={contact?.owner_details?.profile_img || 'assets/img/profiles/default-avatar.jpg'}
                                                alt="img"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="load-btn text-center pb-4">
                <Link to="#" className="btn btn-primary">
                    Load More Contacts
                    <i className="ti ti-loader" />
                </Link>
            </div>
            <AddContactModal contact={selectedContact} setSelectedContact={setSelectedContact}/>
        </>
    )
}
export default ContactGrid;