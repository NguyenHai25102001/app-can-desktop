import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { dataStatus, formatDateTime, formatNumber } from '../components/uitli';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { apis, request_url } from '../components/apis';
import Head from 'next/head';
import "react-datepicker/dist/react-datepicker.css";

const ListData = () => {
    const [token, setToken] = useState('');
    const [page, setPage] = useState(1);
    const [listElectronicScale, setListElectronicScale] = useState([]);
    const [keyStatus, setKeyStatus] = useState('');
    const [keyStatusName, setKeyStatusName] = useState('');
    const [date_to, setDateTo] = useState();
    const [date_form, setDateForm] = useState();
    const [key_search, setKeySearch] = useState('');
    const [totalPage, setTotalPage] = useState(1);
    const [electronic_scale_id, setElectronic_scale_id] = useState('')

    useEffect(() => {
        const fetchToken = async () => {
            const token = await window.ipc.invoke('get-token');
            setToken(token);
            
        };
    
        fetchToken();
    }, [token]);


    const getDataElectronicScale = async () => {

        try {

            const res = await request_url({
                url: apis.electronic_scale(),
                method: 'POST',
                token: token,
                data: {
                    page: page,
                    key_search: key_search,
                    status: keyStatus,
                    date_to: date_to ? format(date_to, 'dd/MM/yyyy HH:mm') : '',
                    date_form: date_form ? format(date_form, 'dd/MM/yyyy HH:mm') : '',

                }
            });


            setListElectronicScale(res?.data?.data)
            setTotalPage(res?.data?.last_page)
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        if(token){
            getDataElectronicScale();
        }

    }, [page, token, key_search, keyStatus, date_to, date_form]);
    useEffect(() => {

        getDataElectronicScale();
    }, []);

    const handleCancel = () => {
        setElectronic_scale_id('');
        setKeySearch('');
        setKeyStatus('');
        setKeyStatusName('');
        setDateTo('');
        setDateForm('');
        getDataElectronicScale();
    };


    const handleDetail = (item) => {
        // Handle detail logic here
    };

    const handlePrint = (
        code_scale,
        customerName,
        licensePlates,
        productName,
        explain,
        dateLoadedScale,
        dateUnLoadedScale,
        loadedScale,
        unloadedScale,
        tare,
        purpose_name,
        total_weight,
        dateTare,
        userCreated
    ) => {
        const details = {
            code_scale,
            customerName,
            licensePlates,
            productName,
            explain,
            dateLoadedScale,
            dateUnLoadedScale,
            loadedScale,
            unloadedScale,
            tare,
            purpose_name,
            total_weight,
            dateTare,
            userCreated,
        };
        window.ipc.send('print-details', details);
    };

    return (
        <React.Fragment>
            <Head>
                <title>Phần mềm cân WinGroup (tel:0354583367)</title>
                <link rel="icon" href="/images/icon.ico" />
            </Head>

            <div className="">
                <div className="w-[100%] m-auto flex items-center gap-2  px-2">
                    <div className=" py-1 px-2 rounded flex-grow">
                        <div className="grid grid-cols-5 gap-3 text-base">

                            <div className="">
                                <label htmlFor="name">Nhập</label>
                                <input id='name' type="search" className={'flex-grow text-sm  text-[#28293D] border rounded-sm h-[40px]  focus-visible:outline-none px-2  w-full'}
                                    placeholder={'Nhập tên khách hàng, tên hàng, biển số xe,...'}
                                    value={key_search}
                                    onChange={(e) => setKeySearch(e.target.value)}
                                />
                            </div>
                            <div className=''>
                                <label htmlFor='status'>Chọn phiếu</label>
                                <Select
                                    id='status'
                                    placeholder={'Chọn phiếu...'}
                                    isClearable
                                    value={keyStatus && keyStatusName ? { value: keyStatus, label: keyStatusName } : { value: keyStatus, label: 'Tất cả phiếu' }}
                                    options={
                                        dataStatus?.map((item) => {
                                            return { value: item.status, label: item.status_name }
                                        })
                                    } className={'w-full h-[40px]'} onChange={(e) => {
                                        setKeyStatus(e?.value);
                                        setKeyStatusName(e?.label);
                                    }} />
                            </div>
                            <div className=''>
                                <label htmlFor='date_to' className='block'>Từ ngày</label>

                                <DatePicker
                                    id='date_to'
                                    selected={date_to}

                                    onChange={(date) =>
                                        setDateTo(date)}
                                    dateFormat="dd/MM/yyyy 'Giờ:' HH:mm"
                                    showYearDropdown
                                    showMonthDropdown
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dropdownMode="select"
                                    locale={vi}
                                    className='border rounded-sm text-sm text-[#28293D] h-[40px] px-2 focus-visible:outline-none w-full'
                                    placeholderText='Ngày bắt đầu...'
                                />

                            </div>
                            <div className=''>

                                <label htmlFor="date_form" className='block'>Đến ngày</label>
                                <DatePicker
                                    id='date_form'
                                    selected={date_form}
                                    onChange={(date) =>
                                        setDateForm(date)}
                                    dateFormat="dd/MM/yyyy 'Giờ:' HH:mm"
                                    showYearDropdown
                                    showMonthDropdown
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dropdownMode="select"
                                    locale={vi}
                                    className='border rounded-sm text-sm text-[#28293D] h-[40px] px-2 focus-visible:outline-none w-full'
                                    placeholderText='Ngày kết thúc...'
                                />
                            </div>
                            <div className="">
                                <div className="flex  justify-center items-center h-full mt-3 gap-1">
                                    <div
                                        onClick={handleCancel}
                                        className="cursor-pointer bg-red-700 text-xl text-white font-semibold px-2 py-1 rounded-lg ">
                                        Hủy
                                    </div>
                                    <div
                                        onClick={() => {
                                            setElectronic_scale_id('');
                                            getDataElectronicScale();
                                        }}
                                        className="cursor-pointer bg-[#3C5EA7] text-xl text-white font-semibold px-2 py-1 rounded-lg">Tìm
                                        phiếu
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                </div>

            </div>


            <div className="p-5">

                <div className="border rounded  relative">
                    <div className="absolute top-0 right-0">
                        <Link href={'/home'} className='px-5 py-3 bg-gray-300 text-xl hover:bg-blue-500 hover:text-white rounded'>Cân hàng</Link>
                    </div>
                    <div className="text-center py-2 text-[20px] font-semibold text-[#28293D] ">
                        Danh sách tạm
                    </div>
                    <div className="">

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right  ">
                                <thead
                                    className="text-[#28293D] text-xl  bg-gray-50  ">
                                    <tr>
                                        <th scope="col" className="">
                                            {/*<div className="flex items-center">*/}
                                            {/*    <input id="checkbox-all-search" type="checkbox"*/}
                                            {/*           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>*/}
                                            {/*    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>*/}
                                            {/*</div>*/}
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-nowrap">
                                            Thông tin khách hàng
                                        </th>
                                        {/* <th scope="col" className="px-3 py-3 text-nowrap">
                                                        Tên hàng
                                                    </th>
                                                    <th scope="col" className="px-3 py-3 text-nowrap">
                                                        Số xe
                                                    </th> */}
                                        <th scope="col" className="px-3 py-3 text-nowrap text-end">
                                            Cân có tải
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-nowrap text-end">
                                            Cân không tải
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-nowrap text-end">
                                            Khối lượng bì
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-nowrap text-end">
                                            Khối lượng Hàng
                                        </th>

                                        {/* <th scope="col" className="px-3 py-3">
                                                        <div className={'text-nowrap'}> Thời gian</div>
                                                        <div className={'text-nowrap'}> cân có tải</div>
                                                    </th>
                                                    <th scope="col" className="px-3 py-3">
                                                        <div className={'text-nowrap'}> Thời gian</div>
                                                        <div className={'text-nowrap'}>không tải</div>
                                                    </th>
                                                    <th scope="col" className="px-3 py-3">
                                                        <div className={'text-nowrap'}> Thời gian</div>
                                                        <div className={'text-nowrap'}>cân bì</div>
                                                    </th> */}

                                        <th scope="col" className="px-3 py-3">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='text-base'>
                                    {
                                        listElectronicScale?.map((item, index) => (
                                            <tr key={index}
                                                onClick={() => {
                                                    handleDetail(item)
                                                    setElectronic_scale_id(item.id)
                                                }}
                                                className={` border-b text-gray-900 bg-gray-100`}
                                                style={{
                                                    backgroundColor: item.id === electronic_scale_id ? '#203DA4' : '',
                                                    color: item.id === electronic_scale_id ? '#ffff' : ''
                                                }}>
                                                <td className="w-4 p-2">
                                                    <div className="flex items-center">
                                                        {index + 1}

                                                    </div>
                                                </td>
                                                <td scope="row"
                                                    className="px-3 py-4 font-medium  whitespace-nowrap dark:text-white">
                                                    <span>Tên KH: </span>
                                                    {item?.supplier_name}

                                                    <div className="text-nowrap">
                                                        <span>Biển số xe: </span>
                                                        {item?.license_plates}
                                                    </div>
                                                    <div className="text-nowrap">
                                                        <span>Tên hàng: </span>
                                                        {item?.product_name}
                                                    </div>

                                                </td>
                                                {/* <td className="px-3 py-4">
                                                                <div className="text-nowrap">
                                                                    {item?.product_name}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-4">
                                                                <div className="text-nowrap">
                                                                    {item?.license_plates}
                                                                </div>
                                                            </td> */}
                                                <td className="px-3 py-4 text-nowrap text-end">
                                                    <div className='font-bold text-xl'> {item?.loaded_scale ? formatNumber(item.loaded_scale) : 0} kg</div>
                                                    <div className="text-nowrap">
                                                        {item?.date_time_loaded_scale ? formatDateTime(item.date_time_loaded_scale) : ''}
                                                    </div>

                                                </td>
                                                <td className="px-3 py-4 text-nowrap text-end">
                                                    <div className='font-bold text-xl'> {item?.unloaded_scale ? formatNumber(item.unloaded_scale) : 0} kg</div>
                                                    <div className="text-nowrap">
                                                        {item?.date_time_unloaded_scale ? formatDateTime(item.date_time_unloaded_scale) : ''}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-nowrap text-end">
                                                    <div className='font-bold text-xl'> {item.tare ? item.tare : 0} kg</div>
                                                    <div className="text-nowrap">
                                                        {item?.date_time_tare ? formatDateTime(item.date_time_tare) : ''}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-nowrap text-end">
                                                    <div className='font-bold text-xl'>  {item.total_weight ? formatNumber(item.total_weight) : 0} kg</div>
                                                </td>
                                                {/* <td className="px-3 py-4">
                                                                <div className="text-nowrap">
                                                                    {item?.date_time_loaded_scale ? formatDateTime(item.date_time_loaded_scale) : ''}
                                                                </div>
                                                            </td>
                                                            <td className='px-3 py-4'>
                                                                <div className="text-nowrap">
                                                                    {item?.date_time_unloaded_scale ? formatDateTime(item.date_time_unloaded_scale) : ''}
                                                                </div>
                                                            </td>
                                                            <td className='px-3 py-4'>
                                                                <div className="text-nowrap">
                                                                    {item?.date_time_tare ? formatDateTime(item.date_time_tare) : ''}
                                                                </div>
                                                            </td> */}

                                                <td className=" px-3 py-4">

                                                    <div className='flex items-center'>
                                                        {item?.status === 1 ?
                                                            (
                                                                <div className="w-full text-center">
                                                                    <div
                                                                        className="bg-[#E5D120] text-white font-bold  text-nowrap px-2 py rounded text-xs cursor-not-allowed">Lưu
                                                                        tạm
                                                                    </div>
                                                                    {/* <div
                                                                                onClick={() => complete_electronic_scale(item?.id)}
                                                                                className="bg-[#13B42D] text-white font-bold  text-nowrap px-2 py rounded text-xs cursor-pointer text-center mt-2">Hoàn
                                                                                thành
                                                                            </div> */}
                                                                </div>
                                                            ) : (
                                                                <div className="w-full">
                                                                    <div
                                                                        onClick={() => complete_electronic_scale(item?.id)}
                                                                        className="bg-[#13B42D] text-white font-bold  text-nowrap px-2 py rounded text-xs cursor-pointer text-center">Hoàn
                                                                        thành
                                                                    </div>
                                                                    <div
                                                                        onClick={() => handlePrint(
                                                                            item?.code_scale,
                                                                            item?.supplier_name,
                                                                            item?.license_plates,
                                                                            item?.product_name,
                                                                            item?.explain,
                                                                            item?.date_time_loaded_scale ? formatDateTime(item?.date_time_loaded_scale) : '',
                                                                            item?.date_time_unloaded_scale ? formatDateTime(item?.date_time_unloaded_scale) : "",
                                                                            formatNumber(item?.loaded_scale),
                                                                            formatNumber(item?.unloaded_scale),
                                                                            formatNumber(item?.tare),
                                                                            item?.purpose_name,
                                                                            formatNumber(item?.total_weight),
                                                                            item?.date_time_tare ? formatDateTime(item?.date_time_tare) : "",
                                                                            item?.user_created ? item?.user_created : '',
                                                                        )}
                                                                        className="bg-[#6E2323] text-white font-bold text-nowrap px-2  rounded text-xs cursor-pointer mt-1 text-center w-full">In
                                                                    </div>
                                                                </div>

                                                            )
                                                        }

                                                    </div>

                                                </td>
                                            </tr>

                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>
                <div className="">
                    <div
                        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-3">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <a
                                href="#"
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </a>
                            <a
                                href="#"
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Next
                            </a>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>

                            </div>
                            <div>
                                <nav
                                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                    aria-label="Pagination"
                                >
                                    <Link
                                        href="#"
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Link>

                                    {
                                        Array.from({ length: totalPage }, (_, i) => i + 1).map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setPage(item)}
                                                style={{
                                                    backgroundColor: item === page ? '#203DA4' : '',
                                                    color: item === page ? '#ffff' : ''
                                                }}
                                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"

                                            >
                                                {item}
                                            </div>
                                        ))
                                    }


                                    <Link
                                        href="#"
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div className="py-14"></div>
        </React.Fragment>
    );
};

export default ListData;
