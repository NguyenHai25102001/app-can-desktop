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
const formatDateTime = (isoString) => {

    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

function calculate(loadedScale, unLoadedScale, tare) {
    const adjustedLoadedScale = loadedScale ?? 0;
    const adjustedUnLoadedScale = unLoadedScale ?? 0;
    const adjustedTare = tare ?? 0;
    const result = adjustedLoadedScale > adjustedUnLoadedScale ? (adjustedLoadedScale - adjustedUnLoadedScale - adjustedTare) : 0;
    // const result = adjustedLoadedScale - adjustedUnLoadedScale - adjustedTare;
    return result;
}
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const dataStatus = [
    {
        status: '',
        status_name: 'Tất cả'

    },
    {
        status: 1,
        status_name: 'Chưa hoàn thành'
    },
    {
        status: 2,
        status_name: 'Hoàn thành'
    }
];


export  {Toast,formatDateTime,calculate,formatNumber}