import React, { useState } from 'react';
import { Link } from "react-router-dom";
import ImageWithDatabase from '../../components/common/ImageFromDatabase';
import ActivitiesModal from './modal/manageCampaignModal';
import moment from 'moment';

const ActivitiesGrid = ({ data }) => {
    const [selectedContact ,setSelectedContact] = useState()
    return (
        <>
            <div className="d-flex flex-wrap">
                
                {data.map((activity, index) => (
                    <div className={`col-xxl-4 col-xl-4 col-md-6 ${index%3 === 1 ? "px-xl-1 py-xl-2 p-md-2" : " p-xl-2 p-md-2" }`} key={activity.id || index}>
                        <div className="card border">
                            <div className="card-body" style={{padding:"10px"}}>
                                <div className="d-flex align-items-center justify-content-between  mb-3">
                                    <div className="d-flex align-items-center">
                                        <img src={activity?.owner?.profile_img} style={{width:'50px',height:"50px",marginRight:'7px' , objectFit:"contain"}}  className="border  shadow-4  rounded-circle" alt='img' />
                                        <div className=''>
                                            <h6>
                                                <Link style={{lineHeight:"1px"}}
                                                    to={activity.contactDetails || '#'}
                                                    className="fw-medium text-capitalize "
                                                >
                                                    {`${activity.title || ''}`}
                                                </Link>
                                            </h6>
                                            <p  className="text-default">
                                               <span
              className={`badge activity-badge ${activity?.activity_type?.name === "Calls" ? "bg-success" : activity?.activity_type?.name === "Emails" ? "bg-purple" : activity?.activity_type?.name === "Task" ? "bg-blue" : activity?.activity_type?.name === "Task" ? "bg-red" : "bg-warning"}`}
            >{activity?.activity_type?.name}</span>
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
                                                          onClick={() => setSelectedContact(activity)} // Set selected contact
                                                        >
                                                          <i className="ti ti-edit text-blue"></i> Edit
                                                        </Link>
                                            <Link
                                                className="dropdown-item"
                                                to="#"
                                                data-bs-toggle="modal"
                                                data-bs-target="#delete_activity"
                                                onClick={() => setSelectedContact(activity.id)} 
                                            >
                                                <i className="ti ti-trash text-danger" /> Delete
                                            </Link>
                                            {/* <Link
                                                className="dropdown-item"
                                                to={activity.contactDetails || '#'}
                                            >
                                                <i className="ti ti-eye text-blue-light" /> Preview
                                            </Link> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-block">
                                    <div className="d-flex flex-column mb-3">
                                        <p className="text-default d-inline-flex gap-2 align-items-center mb-2">
                                          <span className='fw-medium text-black text-nowrap'>  Owner: </span>
                                            {activity.owner?.full_name || 'No Email'}
                                        </p>
                                        {/* <p className="text-default d-inline-flex align-items-center mb-2">
                                            <i className="ti ti-phone text-dark me-1" />
                                            {activity.phone1 || 'No Phone'}
                                        </p>
                                        <p className="text-default d-inline-flex align-items-center">
                                            <i className="ti ti-map-pin-pin text-dark me-1" />
                                            {`${activity.city || ''}, ${activity.country || ''}`}
                                        </p> */}
                                        <p className="text-default d-inline-flex gap-2 align-items-center mb-2">
                                          <span className='fw-medium text-black text-nowrap'>  Due date: </span>
                                            {moment(activity.due_date).format("ll") + " "+ moment(activity.due_time).format("HH:mm A") || 'No Email'}
                                        </p>
                                        <p className="text-default d-inline-flex gap-2 align-items-center mb-2">
                                          <span className='fw-medium text-black text-nowrap'>  Company : </span>
                                            {activity.company_of_activity?.name || 'No Company'}
                                        </p>
                                        <p className="text-default d-inline-flex gap-2 align-items-center mb-2">
                                          <span className='fw-medium text-black text-nowrap'>  Deal : </span>
                                            {activity.deal_of_activity?.dealName || 'No Deal'}
                                        </p>
                                        <p className="text-default d-inline-flex gap-2 align-items-center mb-2">
                                          <span className='fw-medium text-black text-nowrap'>  Contact: </span>
                                            {activity.contact_of_activity?.firstName + " " + activity.contact_of_activity?.lastName || 'No Contact'}
                                        </p>
                                        <p className="text-default d-inline-flex gap-2 align-items-center mb-2">
                                          <span className='fw-medium text-black text-nowrap'>  Priority: </span>
                                          <span
              className={`badge activity-badge ${activity.priority == 1 ? "text-success" : activity.priority == 2 ? "text-warning"  : activity.priority === 3 ? "text-danger" : "text-info"}`}
            >  {activity.priority === 1 ? "Low" :activity.priority ===2 ? "Normal" : activity.priority ==3 ? "High" :  'No Priority'}</span>
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {activity.tags && activity.tags.split(',').map((tag, i) => (
                                            <span key={i} className="badge badge-tag badge-success-light me-2">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {/* <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <div className="d-flex align-items-center grid-social-links">
                                        {Object.entries(activity.socialProfiles || {}).map(([key, value], i) => (
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
                                            {activity.reviews || 'N/A'}
                                        </div>
                                        <Link
                                            to="#"
                                            className="avatar avatar-md"
                                            data-bs-toggle="tooltip"
                                            data-bs-original-title={activity.owner_details?.full_name || 'Owner'}
                                            data-bs-placement="top"
                                        >
                                            <ImageWithDatabase
                                                src={activity?.owner_details?.profile_img || 'assets/img/profiles/default-avatar.jpg'}
                                                alt="img"
                                            />
                                        </Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="load-btn text-center pb-4">
                <Link to="#" className="btn btn-primary">
                    Load More Activity
                    <i className="ti ti-loader" />
                </Link>
            </div>
            <ActivitiesModal setActivity={setSelectedContact} activity={selectedContact} />
            {/* <AddContactModal contact={selectedContact} setSelectedContact={setSelectedContact}/> */}
        </>
    )
}
export default ActivitiesGrid;