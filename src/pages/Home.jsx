import React, { useEffect, useState } from "react";
import AddNote from "../components/AddNote";
import NoteCard from "../components/NoteCard";
import { notesService } from "../services/authService";
import Swal from "sweetalert2";

export default function Home() {
    const msgStyle = {
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        height: "50vh",
        color: "#aaa",
        letterSpacing: "1px",
        fontSize: "1.3em",
    };
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const response = await notesService.getAllNotes();
                
                if (response.success && response.content) {
                    setNotes(response.content);
                } else {
                    setNotes([]);
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
                setNotes([]);
                
                if (error.message !== 'Failed to fetch notes') {
                    Swal.fire({
                        title: 'Error',
                        text: error.message || 'Failed to load notes',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchNotes();
    }, []);
    if (loading) {
        return (
            <div style={msgStyle}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span style={{ marginLeft: '10px' }}>Loading notes...</span>
            </div>
        );
    }

    return (
        <div>
            <h1 className="headline">
                Save Your <span>Notes</span> Here
            </h1>

            <div className="cards">
                {notes && notes.length > 0 ? (
                    notes.map((note) => (
                        <NoteCard key={note._id} note={note} />
                    ))
                ) : (
                    <p style={msgStyle}>No Notes To Show</p>
                )}
            </div>
            <AddNote />
        </div>
    );
}
