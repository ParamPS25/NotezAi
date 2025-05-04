import {useEffect,useState,React} from 'react'
import { createPortal } from 'react-dom'
import { useRef } from 'react'

const NoteMenuPortal = ({children, onClose , position}) => {
    const portalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (portalRef.current && !portalRef.current.contains(event.target)) {
                onClose(); // Close the menu when clicking outside
            }
        };

        // Add event listener to detect clicks outside the menu
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return createPortal(
        <div
            ref = {portalRef}
            className = "absolute z-99 bg-white shadow-lg rounded-md p-2 w-35 sm:w-40 md:w-54 " 
            style={{
                top: position.top,
                left: position.left + 74,
                position: 'absolute',
            }}
        >
            {children}
        </div>,
        document.body  // this is where the portal will be rendered
    );
};

export default NoteMenuPortal
