import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notesService } from "../services/authService";
import Swal from "sweetalert2";

export default function DetailCard({ note }) {
    const btnStyle = {
        padding: "0.5em 1em",
        fontSize: "1.1em",
        letterSpacing: "1px",
        background: "linear-gradient(#c53913, #f5400f)",
        color: "#f4f0e4",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        textDecoration: "none",
    };
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    
    const deleteNote = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeleting(true);
                try {
                    const response = await notesService.deleteNote(note._id);
                    if (response.success) {
                        navigate("/");
                        Swal.fire(
                            "Deleted!",
                            "Your Note has been deleted.",
                            "success"
                        );
                    }
                } catch (error) {
                    console.error('Delete note error:', error);
                    Swal.fire(
                        "Error!",
                        error.message || "Failed to delete note",
                        "error"
                    );
                } finally {
                    setDeleting(false);
                }
            }
        });
    };
    return (
        <div className="note-details">
            <h1 className="title">{note.title}</h1>
            <p className="details">{note.details}</p>
            <div className="action">
                <Link style={btnStyle} to={`/edit/${note._id}`}>
                    {" "}
                    Edit
                </Link>
                <button style={btnStyle} onClick={deleteNote} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
}
