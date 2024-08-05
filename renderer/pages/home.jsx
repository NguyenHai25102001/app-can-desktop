import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head';
import { apis, request_url } from "../components/apis";
import CreatableSelect from 'react-select/creatable';
import Link from "next/link";
import { calculate, dataStatus, formatDateTime, formatNumber, Toast } from "../components/uitli";
import Load from '../components/load';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';


export default function HomePage() {
    const [serialData, setSerialData] = useState(0);
    const [listCustomer, setListCustomer] = useState([]);
    const [token, setToken] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [page, setPage] = useState(1)
    const [listElectronicScale, setListElectronicScale] = useState([]);
    const [totalPage, setTotalPage] = useState(1)
    const [loadedScale, setLoadedScale] = useState(0)
    const [unLoadedScale, setUnLoadedScale] = useState(0)
    const [licensePlates, setLicensePlates] = useState('');
    const [dateLoadedScale, setDateLoadedScale] = useState('')
    const [dateUnLoadedScale, setDateUnLoadedScale] = useState('');
    const [productName, setProductName] = useState('')
    const [explain, setExplain] = useState('');
    const [purpose, setPurpose] = useState(1);
    const [electronic_scale_id, setElectronic_scale_id] = useState('')
    const [tare, setTare] = useState(0);
    const [explainTare, setExplainTare] = useState('');
    const [loading, setLoading] = useState(false);
    const [code_scale, setCodeScale] = useState('');
    const [purpose_name, setPurposeName] = useState('');
    const [total_weight, setTotalWeight] = useState('');
    const [key_search, setKeySearch] = useState('');
    const [dateTare, setDateTare] = useState('');
    const [userCreated, setUserCreated] = useState('');
    const [status, setStatus] = useState('');
    const [keyStatus, setKeyStatus] = useState('');
    const [keyStatusName, setKeyStatusName] = useState('');
    const [date_to, setDateTo] = useState();
    const [date_form, setDateForm] = useState();
    const [error_message, setErrorMessage] = useState({
        licensePlatesError: true,
        licensePlatesMessage: '',
        customerNameError: true,
        customerNameMessage: '',
        productNameError: true,
        productNameMessage: '',
    })
    const checkErrorMessage = (licensePlates, customer, product_name) => {
        let isValid = true;

        if (licensePlates === '') {
            setErrorMessage(prevState => ({ ...prevState, licensePlatesError: true, licensePlatesMessage: 'Vui lòng nhập biển số xe' }));
            isValid = false;
        } else {
            setErrorMessage(prevState => ({ ...prevState, licensePlatesError: false, licensePlatesMessage: '' }));
        }

        if (customer === '') {
            setErrorMessage(prevState => ({ ...prevState, customerNameError: true, customerNameMessage: 'Vui lòng chọn khách hàng' }));
            isValid = false;
        } else {
            setErrorMessage(prevState => ({ ...prevState, customerNameError: false, customerNameMessage: '' }));
        }

        if (product_name === '') {
            setErrorMessage(prevState => ({ ...prevState, productNameError: true, productNameMessage: 'Vui lòng nhập tên hàng' }));
            isValid = false;
        } else {
            setErrorMessage(prevState => ({ ...prevState, productNameError: false, productNameMessage: '' }));
        }

        return isValid;
    }

    const handleChangeErrorMessage = (name, value, message, keyError, keyMessage) => {
        if (value === '' && value === undefined && value === null) {
            setErrorMessage(prevState => ({ ...prevState, [keyError]: false, [keyMessage]: message }));
        } else {
            setErrorMessage(prevState => ({ ...prevState, [keyError]: true, [keyMessage]: '' }));
        }
    }

    const resetErrorMessage = () => {
        setErrorMessage({
            licensePlatesError: false,
            licensePlatesMessage: '',
            customerNameError: false,
            customerNameMessage: '',
            productNameError: false,
            productNameMessage: '',
        })
    }

    useEffect(() => {
        const fetchToken = async () => {
            const token = await window.ipc.invoke('get-token');
            setToken(token);
        };
        fetchToken();
    }, [token]);



    const handleLoadedScale = (value) => {
        setLoadedScale(value)
    }
    const handleUnLoadedScale = (value) => {
        setUnLoadedScale(value)
    }


    const getDataListCustomer = async () => {
        try {
            const res = await request_url({
                url: apis.listCustomer(),
                method: 'POST',
                token: token,
                data: {
                    key_search: 'Cân',
                }
            });
            setListCustomer(res.data)
        } catch (e) {
            console.log(e);
        }
    }

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
        getDataElectronicScale();
    }, [page]);

    useEffect(() => {
        getDataElectronicScale();
        setPage(1)
    }, [token, key_search, date_form, date_to, keyStatus]);

    useEffect(() => {
        window.ipc.onSerialData((data) => {
            if (data.length > 4) {
                setSerialData(parseInt(data));
            }
        });
    }, []);

    const handleCustomerChange = (selectedOption) => {
        setCustomerName(selectedOption ? selectedOption.value : '');
        if (selectedOption) {
            const customer = listCustomer.find((item) => item.name === selectedOption.value);
            setCustomerId(customer?.id)
        }
    };


    const handleStoreElectronicScale = async () => {

        if (!checkErrorMessage(licensePlates, customerName, productName)) {
            return;
        }
        if (loadedScale === '' || unLoadedScale === '') {
            Toast({ type: 'warning', message: 'Vui lòng nhập đủ thông tin!' })
            console.log(loadedScale, unLoadedScale);
            return;
        }
        setLoading(true);
        try {
            const res = await request_url({
                url: apis.store_electronic_scale(),
                method: 'POST',
                token: token,
                data: {
                    supplier_id: customerId,
                    license_plates: licensePlates,
                    supplier_name: customerName,
                    product_categories_id: '',
                    product_id: '',
                    product_name: productName,
                    explain: explain,
                    loaded_scale: loadedScale,
                    unloaded_scale: unLoadedScale,
                    purpose: purpose,
                    tare: tare,
                    explain_tare: explainTare,
                    purpose_name: purpose_name
                }
            });

            if (res?.status) {
                resetForm();
                getDataElectronicScale(1);
                getDataListCustomer();
                Toast({ type: 'success', message: 'Tạo phiếu lưu tạm thành công!' })
            } else {
                Toast({ type: 'error', message: 'Tạo phiếu lưu tạm thất bại!' })
            }
        } catch (e) {
            Toast({ type: 'error', message: 'Tạo phiếu lưu tạm thất bại!' })

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
    }

    const handleUpdateElectronicScale = async () => {
        if (loadedScale === '' || unLoadedScale === '') {
            Toast({ type: 'warning', message: 'Vui lòng nhập đủ thông tin!' })
            return;
        }
        checkErrorMessage(licensePlates, customerName, productName)
        setLoading(true);
        try {

            const res = await request_url({
                url: apis.update_electronic_scale(),
                method: 'POST',
                token: token,
                data: {
                    electronic_scale_id: electronic_scale_id,
                    supplier_id: customerId,
                    license_plates: licensePlates,
                    supplier_name: customerName,
                    product_categories_id: '',
                    product_id: '',
                    product_name: productName,
                    explain: explain,
                    loaded_scale: loadedScale,
                    unloaded_scale: unLoadedScale,
                    purpose: purpose,
                    tare: tare,
                    explain_tare: explainTare,
                    purpose_name: purpose_name
                }
            });


            if (res?.status) {
                handleDetail(res?.data);
                getDataListCustomer();
                getDataElectronicScale(1);
                Toast({ type: 'success', message: 'Cập nhật phiếu lưu tạm thành công!' })
            } else {
                console.log(res)
                Toast({ type: 'error', message: 'Cập nhật phiếu lưu tạm thất bại!' })
            }
        } catch (e) {
            Toast({ type: 'error', message: 'Cập nhật phiếu lưu tạm thất bại!' })

        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1500); // Set the loading state to false after 3 seconds
        }
    }

    const resetForm = () => {
        setElectronic_scale_id('')
        setCustomerId('');
        setCustomerName('');
        setLicensePlates('')
        setProductName('')
        setLoadedScale(0)
        setUnLoadedScale(0)
        setExplainTare('');
        setCustomerName('');
        setDateUnLoadedScale('');
        setDateLoadedScale('')
        setTare(0);
        setExplain('')
        setDateTare('');
        setUserCreated('');
        setCodeScale('');
        setPurpose('');
        setPurposeName('');
        setStatus('');
    }

    const handleDetail = (item) => {
        console.log(item);
        setElectronic_scale_id(item?.id)
        setCustomerName(item.supplier_name ? item.supplier_name : '')
        setLicensePlates(item?.license_plates ? item.license_plates : '')
        setProductName(item?.product_name ? item.product_name : '')
        setLoadedScale(item?.loaded_scale)
        setUnLoadedScale(item.unloaded_scale)
        setExplain(item?.explain)
        setDateLoadedScale(item?.date_time_loaded_scale);
        setDateUnLoadedScale(item?.date_time_unloaded_scale);
        setTare(item?.tare);
        setExplainTare(item?.explain_tare);
        setCodeScale(item?.code_scale);
        setPurposeName(item?.purpose_name);
        setTotalWeight(item?.total_weight);
        setDateTare(item?.date_time_tare);
        setUserCreated(item?.user_created);
        setPurpose(item?.purpose);
        setStatus(item?.status);
    }

    const complete_electronic_scale = async (id) => {
        try {
            const res = await request_url({
                url: apis.complete_electronic_scale(),
                method: 'POST',
                token: token,
                data: {
                    electronic_scale_id: id
                }
            });

            if (res?.status) {
                getDataListCustomer();
                Toast({ type: 'success', message: 'Hoàn thành phiếu lưu tạm thành công!' })
            } else {
                console.log(res)
                Toast({ type: 'error', message: 'Hoàn thành phiếu lưu tạm thất bại!' })
            }
        } catch (e) {
            Toast({ type: 'error', message: 'Hoàn thành phiếu lưu tạm thất bại!' })

        }
    }
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
    const handleOpenListData = () => {
        window.ipc.send('open-list-data-window');
    };

    const handleCancel = () => {
        setElectronic_scale_id('');
        setKeySearch('');
        setKeyStatus('');
        setKeyStatusName('');
        setDateTo('');
        setDateForm('');
        getDataElectronicScale();
    };

    const dataPurpose = [
        {
            purpose: 1,
            purpose_name: 'PHIẾU NHẬP'
        },
        {
            purpose: 2,
            purpose_name: 'PHIẾU XUẤT'
        },
        {
            purpose: 3,
            purpose_name: 'DỊCH VỤ'
        }
    ];




    return (
        <React.Fragment>
            {
               
                    <React.Fragment>
                        <Head>
                            <title>Phần mềm cân WinGroup (tel:0354583367)</title>
                            <link rel="icon" href="/images/icon.ico" />
                        </Head>
                        <div className="fixed h-[70px] bg-[#203DA4] w-full text-[#FFFFFF] z-10">
                            <div className="flex items-center justify-between px-10 h-full">
                                <div className="flex gap-3 items-center">
                                    <div className="">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="41" height="34" viewBox="0 0 41 34"
                                            fill="none">
                                            <path
                                                d="M0 22.0934C0 19.653 1.97831 17.6747 4.41867 17.6747H11.2922C13.7325 17.6747 15.7108 19.653 15.7108 22.0934V28.9669C15.7108 31.4072 13.7325 33.3855 11.2922 33.3855H4.41867C1.97831 33.3855 0 31.4072 0 28.9669V22.0934Z"
                                                fill="white" />
                                            <path
                                                d="M23.5663 20.1295C22.7528 20.1295 22.0934 20.789 22.0934 21.6024C22.0934 22.4159 22.7528 23.0753 23.5663 23.0753H33.3855C34.199 23.0753 34.8584 22.4159 34.8584 21.6024C34.8584 20.789 34.199 20.1295 33.3855 20.1295H23.5663Z"
                                                fill="white" />
                                            <path
                                                d="M39.2771 27.9849H23.5663C22.7528 27.9849 22.0934 28.6444 22.0934 29.4578C22.0934 30.2713 22.7528 30.9307 23.5663 30.9307H39.2771C40.0906 30.9307 40.75 30.2713 40.75 29.4578C40.75 28.6444 40.0906 27.9849 39.2771 27.9849Z"
                                                fill="white" />
                                            <path
                                                d="M0 3.92771C0 1.7585 1.7585 0 3.92771 0H35.3494C37.5186 0 39.2771 1.7585 39.2771 3.92771V9.81928C39.2771 11.9885 37.5186 13.747 35.3494 13.747H3.92771C1.7585 13.747 0 11.9885 0 9.81928V3.92771Z"
                                                fill="white" />
                                        </svg>
                                    </div>
                                    <div className="text-sm font-semibold">
                                        <div className="">CUONG TAN LIMITED COMPANY</div>
                                        <div className="">Công ty giống Cường Tân</div>
                                    </div>
                                </div>
                                <div className="uppercase font-bold text-[22px]">PHẦN MỀM CÂN ĐỒNG BỘ</div>
                            </div>
                        </div>

                        <div className="pt-[70px]">
                            <div className="w-[95%] m-auto border-2 rounded-lg mt-5 relative">
                                {/* <div className="p-5 border-b-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xl font-semibold text-[#28293D">Phiếu Cân</div>
                                        <div className="">
                                    <select className={'bg-[#06C270] text-white text-sm font-bold px-2 py-1 rounded'}>
                                        <option value="1">Có Tải trọng</option>
                                        <option value="2">Có không tải</option>
                                    </select>
                                </div>
                                    </div>
                                </div> */}
                                <div className="">
                                    <div className='flex w-full '>
                                        <div className='w-[50%] p-5'>

                                            <table className='w-full '>
                                                <tbody>
                                                    <tr className=''>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Mã số phiếu</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <div>
                                                                {
                                                                    code_scale ?
                                                                        (<div >
                                                                            <div className="text-base text-[#28293D] font-semibold">{code_scale}  {userCreated ?
                                                                                (<span className='ml-8'>
                                                                                    ({userCreated})
                                                                                </span>) : ''}</div>
                                                                        </div>) : ('')
                                                                }

                                                            </div>

                                                        </td>
                                                    </tr>
                                                    <tr className=''>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Số xe</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <input type="text" value={licensePlates}

                                                                onChange={(e) => {
                                                                    setLicensePlates(e.target.value),
                                                                        handleChangeErrorMessage('licensePlates', e.target.value, 'Vui lòng nhập biển số xe', 'licensePlatesError', 'licensePlatesMessage')
                                                                }}
                                                                className={'mt-2 h-[36px] w-full border text-center py-2 rounded text-sm font-bold text-[#5C64D0]'} />
                                                            <div className='text-red-600 text-base font-medium'>{error_message.licensePlatesError ? error_message.licensePlatesMessage : ""}</div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Khách hàng</div>
                                                        </td>

                                                        <td className='py-1 '>
                                                            <CreatableSelect
                                                                placeholder={'Nhập khách hàng...'}
                                                                isClearable
                                                                value={customerName ? { value: customerName, label: customerName } : null}
                                                                options={
                                                                    listCustomer?.map((item) => {
                                                                        return { value: item.name, label: item.name }
                                                                    })

                                                                } className={'w-full h-[40px] mt-2'} onChange={(e) => {
                                                                    handleCustomerChange(e)
                                                                    handleChangeErrorMessage('customerName', e?.value, 'Vui lòng chọn khách hàng', 'customerNameError', 'customerNameMessage')
                                                                }} />
                                                            <div className='text-red-600 text-base font-medium'>{error_message.customerNameError ? error_message.customerNameMessage : ""}</div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Trạng thái cân</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <Select
                                                                placeholder={'Chọn phiếu...'}
                                                                isClearable
                                                                value={purpose && purpose_name ? { value: purpose, label: purpose_name } : null}
                                                                options={
                                                                    dataPurpose?.map((item) => {
                                                                        return { value: item.purpose, label: item.purpose_name }
                                                                    })


                                                                } className={'w-full h-[40px] mt-2'} onChange={(e) => {
                                                                    setPurpose(e?.value);
                                                                    setPurposeName(e?.label)
                                                                }} />

                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Tên hàng</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <input type="text"
                                                                value={productName}
                                                                onChange={(e) => {
                                                                    setProductName(e.target.value);
                                                                    handleChangeErrorMessage('productName', e.target.value, 'Vui lòng nhập tên hàng', 'productNameError', 'productNameMessage')
                                                                }}
                                                                className={'mt-2 border h-[36px] text-center py-2 rounded text-sm font-bold text-[#5C64D0] w-full'} />
                                                            <div className='text-red-600 text-base font-medium'>{error_message.productNameError ? error_message.productNameMessage : ""}</div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Số bì</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <input type="number"
                                                                value={tare}
                                                                onChange={(e) => setTare(e.target.value)}
                                                                className={'mt-2 border h-[36px] text-center py-2 rounded text-sm font-bold text-[#5C64D0] w-full'} />
                                                        </td>
                                                    </tr>

                                                    {/* <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Ghi chú bì</div>                                                        </td>

                                                        <td className='py-1'>
                                                            <textarea
                                                                className={'mt-2 border w-full text-start py-2 px-2 rounded text-sm font-bold text-[#5C64D0] '}
                                                                onChange={(e) => setExplainTare(e.target.value)}
                                                                placeholder={'Nhập...'} value={explainTare}>

                                                            </textarea>
                                                        </td>
                                                    </tr> */}

                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Ghi chú</div>                                                        </td>

                                                        <td className='py-1'>
                                                            <textarea
                                                                className={'mt-2 border w-full text-start py-2 px-2 rounded text-sm font-bold text-[#5C64D0] '}
                                                                onChange={(e) => setExplain(e.target.value)}
                                                                value={explain}
                                                                placeholder={'Nhập...'}>
                                                            </textarea>
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </table>

                                        </div>
                                        <div className="w-[50%] p-5">
                                            <div className="  py-2 px-3 border bg-gray-100 text-center rounded-xl ">
                                                <div className="text-base text-[#28293D] font-semibold">Khối lượng cân thực thế</div>
                                                <div className="flex items-end justify-center">
                                                    <div
                                                        className="text-gradient text-[40px] font-semibold w-[150px] text-end">{formatNumber(serialData)}</div>
                                                    <div className="text-xl text-[#28293D] font-semibold ml-3">Kg</div>
                                                </div>
                                            </div>

                                            <div className=" mt-5">
                                                <div>
                                                    <div className=" border-2 rounded px-3 py-1">
                                                        <table className='table-auto w-full content'>
                                                            <tbody>
                                                                <tr className=''>
                                                                    <td className='px-3  font-semibold text-nowrap hover:bg-blue-200 cursor-pointer text-xl'
                                                                        onClick={() => handleLoadedScale(serialData)}>Cân có tải:</td>
                                                                    <td className='px-3  font-bold text-end text-2xl'>{formatNumber(loadedScale)}</td>
                                                                    <td className='text-sm min-w-[100px]'>
                                                                        <div className=' mt-2  ml-2'>
                                                                            {dateLoadedScale ? formatDateTime(dateLoadedScale) : ''}
                                                                        </div>

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='px-3  font-semibold hover:bg-blue-200 cursor-pointer text-xl'
                                                                        onClick={() => handleUnLoadedScale(serialData)}>Cân không tải:</td>
                                                                    <td className='px-3  text-2xl font-bold text-end'>{formatNumber(unLoadedScale)}</td>
                                                                    <td className='text-sm  '>
                                                                        <div className=' mt-2 ml-2'>
                                                                            {dateUnLoadedScale ? formatDateTime(dateUnLoadedScale) : ''}
                                                                        </div>
                                                                    </td>

                                                                </tr>
                                                                <tr>
                                                                    <td className='px-3  font-semibold text-xl'>Trọng lượng hàng:</td>
                                                                    <td className='px-3  text-2xl font-bold text-end'>{formatNumber(calculate(loadedScale, unLoadedScale, 0))}</td>
                                                                    <td className='text-sm '>

                                                                    </td>

                                                                </tr>
                                                                <tr>
                                                                    <td className='px-3  font-semibold text-xl'>Trừ bì:</td>
                                                                    <td className='px-3  text-2xl font-bold text-end'>{tare ? formatNumber(tare) : ''}</td>
                                                                    <td className='text-sm min-w-[100px]'>
                                                                        <div className=' mt-2  ml-2'>
                                                                            {dateTare !== null && dateTare !== '' ? formatDateTime(dateTare) : ''}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td className='border-b-2 border-black'></td>
                                                                    <td></td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='px-3  font-semibold text-xl'>Trọng lượng thực tế:</td>
                                                                    <td className='  text-2xl font-bold text-end translate-x-6' >
                                                                        {formatNumber(calculate(loadedScale, unLoadedScale, tare))}
                                                                        <sub>Kg</sub></td>
                                                                    <td></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>


                                    </div>


                                    {
                                        electronic_scale_id === '' ? (
                                            <div className="flex justify-center mb-3 gap-3">
                                                <div
                                                    className="inline-block text-xl rounded-lg font-semibold text-[#28293D] bg-gray-200 px-5 py-1 cursor-pointer select-none"
                                                    onClick={() => {
                                                        resetForm(), resetErrorMessage()
                                                    }}>Phiếu mới
                                                </div>
                                                <div
                                                    onClick={handleStoreElectronicScale}
                                                    className="inline-block text-xl rounded-lg font-semibold text-[#28293D] bg-gray-200 px-5 py-1 cursor-pointer select-none">Lưu
                                                    tạm
                                                </div>
                                            </div>

                                        ) : (
                                            <div className="flex justify-center mb-3 gap-3 ">
                                                <div
                                                    onClick={resetForm}
                                                    className="inline-block text-xl rounded-lg font-semibold text-[#28293D] bg-gray-200 px-5 py-1 cursor-pointer select-none" >Phiếu
                                                    mới
                                                </div>
                                                <div
                                                    onClick={handleUpdateElectronicScale}
                                                    className="inline-block text-xl rounded-lg font-semibold text-[#28293D] bg-gray-200 px-5 py-1 cursor-pointer select-none">Cập
                                                    nhật
                                                </div>

                                                {
                                                    status === 2 ? (
                                                        <div
                                                            onClick={() => complete_electronic_scale(electronic_scale_id)}
                                                            className="inline-block text-xl rounded-lg font-semibold text-[#28293D] bg-gray-200 px-5 py-1 cursor-pointer select-none">Hoàn
                                                            thành
                                                        </div>
                                                    ) : ('')
                                                }


                                                <div
                                                    onClick={() => handlePrint(
                                                        code_scale,
                                                        customerName,
                                                        licensePlates,
                                                        productName,
                                                        explain,
                                                        dateLoadedScale ? formatDateTime(dateLoadedScale) : '',
                                                        dateUnLoadedScale ? formatDateTime(dateUnLoadedScale) : '',
                                                        formatNumber(loadedScale),
                                                        formatNumber(unLoadedScale),
                                                        formatNumber(tare),
                                                        purpose_name,
                                                        formatNumber(total_weight),
                                                        dateTare ? formatDateTime(dateTare) : '',
                                                        userCreated ? userCreated : '',

                                                    )}
                                                    className="inline-block text-xl rounded-lg font-semibold text-[#28293D] bg-gray-200 px-5 py-1 cursor-pointer select-none">In
                                                </div>

                                            </div>

                                        )
                                    }


                                </div>


                            </div>

                        </div>

                        <div className="">
                            <div className="w-[100%] m-auto flex items-center gap-2  px-2 mt-5">
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

                            <div className="border rounded ">

                                <div className="text-center py-2 text-[20px] font-semibold text-[#28293D] ">
                                    Danh sách tạm
                                </div>
                                <div className="">

                                    <div className=" overflow-x-auto shadow-md sm:rounded-lg">
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
            }


        </React.Fragment >


    )
}
