import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notesService } from "../services/authService";
import DetailCard from "../components/DetailCard";
import Swal from "sweetalert2";

export default function NoteDetails() {
    const { id } = useParams();
    const [note, setNote] = useState({
        id: "",
        title: "",
        details: "",
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchNote = async () => {
            try {
                setLoading(true);
                const response = await notesService.getNote(id);
                if (response.success) {
                    setNote(response.content);
                }
            } catch (error) {
                console.error('Error fetching note:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to load note',
                    icon: 'error'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);
    if (loading) {
        return (
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                <p>Loading note...</p>
            </div>
        );
    }
    
    return (
        <div className="container">
            <DetailCard note={note} />
        </div>
    );
}
