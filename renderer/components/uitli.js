import Swal from "sweetalert2";

const Toast = ({ type, message }) => {
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    if (type === 'error') {
        toast.fire({
            icon: 'error',
            title: message
        });
    } else if (type === 'success') {
        toast.fire({
            icon: 'success',
            title: message
        });
    } else if (type === 'warning') {
        toast.fire({
            icon: 'warning',
            title: message
        });
    }
};

export  {Toast}