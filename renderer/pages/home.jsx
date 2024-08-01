import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { apis, request_url } from "../components/apis";
import CreatableSelect from 'react-select/creatable';

import Link from "next/link";
import { calculate, formatDateTime, Toast } from "../components/uitli";
import Load from '../components/load';
import { set } from 'electron-pdf/lib/logger';


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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = sessionStorage.getItem('token_customer');
            if (token) {
                setToken(token);
            }
        }
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
                }
            });

            setListElectronicScale(res?.data?.data)
            setTotalPage(res?.data?.last_page)
        } catch (e) {
            console.log(e)
        }

    }


    useEffect(() => {
        getDataListCustomer();
    }, [token]);
    useEffect(() => {
        getDataElectronicScale(page);
    }, [page, token]);



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
        if (licensePlates === '' || productName === '' || loadedScale === 0 || customerName === '') {
            Toast({ type: 'warning', message: 'Vui lòng nhập đủ thông tin!' })
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
                    purpose_name: purpose === 1 ? "PHIẾU NHẬP" : purpose === 2 ? "NHẬP" : purpose === 3 ? "XUẤT" : ""
                }
            });

            if (res?.status) {

                handleDetail(res?.data);
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
            }, 2000);
        }
    }

    const handleUpdateElectronicScale = async () => {
        if (licensePlates === '' || productName === '' || loadedScale === 0 || customerName === '' || electronic_scale_id === '') {
            Toast({ type: 'warning', message: 'Vui lòng nhập đủ thông tin!' })
            return;
        }
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
                    purpose_name: purpose === 1 ? "PHIẾU NHẬP" : purpose === 2 ? "NHẬP" : purpose === 3 ? "XUẤT" : ""
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
            }, 2000); // Set the loading state to false after 3 seconds
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
        setExplain('');
        setCustomerName('');
        setDateUnLoadedScale('');
        setDateLoadedScale('')
        setTare(0);
    }

    const handleDetail = (item) => {
        setElectronic_scale_id(item?.id)
        setCustomerName(item?.supplier_name)
        setLicensePlates(item?.license_plates)
        setProductName(item?.product_name)
        setLoadedScale(item?.loaded_scale)
        setUnLoadedScale(item.unloaded_scale)
        setExplain(item?.explain)
        setDateLoadedScale(item?.date_time_loaded_scale)
        setDateUnLoadedScale(item?.date_time_unloaded_scale)
        setTare(item?.tare);
        setExplainTare(item?.explain_tare);
        setCodeScale(item?.code_scale);
        setPurposeName(item?.purpose_name);
        setTotalWeight(item?.total_weight);
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
        total_weight
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
            total_weight
        };
        window.ipc.send('print-details', details);
    };

    return (
        <React.Fragment>

            {
                loading ? (
                    <Load />

                ) : (
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
                                        <div className='w-[40%] p-5'>

                                            <table className='w-full'>
                                                <tbody>
                                                    <tr className=''>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Số xe</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <input type="text" value={licensePlates}
                                                                onChange={(e) => setLicensePlates(e.target.value)}
                                                                className={'mt-2 h-[36px] w-full border text-center py-2 rounded text-sm font-bold text-[#5C64D0]'} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Khách hàng</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <CreatableSelect
                                                                placeholder={'Nhập khách hàng...'}
                                                                isClearable
                                                                value={customerName ? { value: customerName, label: customerName } : null}
                                                                options={
                                                                    listCustomer?.map((item) => {
                                                                        return { value: item.name, label: item.name }
                                                                    })

                                                                } className={'w-full h-[40px] mt-2'} onChange={handleCustomerChange} />
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Trạng thái cân</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <select
                                                                className={'mt-2 border h-[36px] w-full text-center py-2 rounded text-sm font-bold text-[#5C64D0]'}
                                                                value={purpose}
                                                                onChange={(e) => setPurpose(e.target.value)}>
                                                                <option value="1">PHIẾU NHẬP</option>
                                                                <option value="2">PHIẾU XUẤT</option>
                                                                <option value="3">DỊCH VỤ</option>
                                                            </select>
                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Tên hàng</div>
                                                        </td>

                                                        <td className='py-1'>
                                                            <input type="text"
                                                                value={productName}
                                                                onChange={(e) => setProductName(e.target.value)}
                                                                className={'mt-2 border h-[36px] text-center py-2 rounded text-sm font-bold text-[#5C64D0] w-full'} />
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

                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Ghi chú bì</div>                                                        </td>

                                                        <td className='py-1'>
                                                            <textarea
                                                                className={'mt-2 border w-full text-start py-2 px-2 rounded text-sm font-bold text-[#5C64D0] '}
                                                                onChange={(e) => setExplainTare(e.target.value)}

                                                                placeholder={'Nhập...'}>{explainTare}

                                                            </textarea>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className='py-1'>
                                                            <div className="text-base text-[#28293D] font-semibold">Ghi chú</div>                                                        </td>

                                                        <td className='py-1'>
                                                            <textarea
                                                                className={'mt-2 border w-full text-start py-2 px-2 rounded text-sm font-bold text-[#5C64D0] '}
                                                                onChange={(e) => setExplain(e.target.value)}

                                                                placeholder={'Nhập...'}>{explain}

                                                            </textarea>
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </table>

                                        </div>
                                        <div className="w-[60%] pl-5 pt-5 pb-5">
                                            <div className='font-medium text-l '>Khối lượng cân hiện tại:</div>

                                            <div className="flex justify-between items-end mt-5">
                                                <div>
                                                    <div className=" border-2 rounded px-3 py-1">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td className='px-3 py-1 font-semibold text-nowrap'>Trọng lượng hàng:</td>
                                                                    <td className='px-3 py-1 text-xl font-bold text-end'>{loadedScale}</td>
                                                                    <td className='text-sm '>
                                                                        <div className=' mt-2'>
                                                                            {dateLoadedScale ?? formatDateTime(dateLoadedScale)}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className='px-3 py-1 font-semibold'>Trọng lượng xe:</td>
                                                                    <td className='px-3 py-1 text-xl font-bold text-end'>{unLoadedScale}</td>
                                                                    <td className='text-sm '>
                                                                        <div className=' mt-2'>
                                                                            {dateLoadedScale ?? formatDateTime(dateLoadedScale)}
                                                                        </div>
                                                                    </td>

                                                                </tr>
                                                                <tr>
                                                                    <td className='px-3 py-1 font-semibold'>Trừ bì:</td>
                                                                    <td className='px-3 py-1 text-xl font-bold text-end'>{tare??0}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td className='border-b-2 border-black'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td></td>
                                                                    <td className=' py-1 text-xl font-bold text-end' >
                                                                      {calculate(loadedScale, unLoadedScale, tare)}
                                                                         <sub>Kg</sub></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="  py-2 px-3 bg-[#E5D120] text-center rounded-tl-3xl inline-block ">
                                                    <div className="text-base text-[#28293D] font-semibold">Trọng lượng</div>
                                                    <div className="flex items-end justify-center">
                                                        <div
                                                            className="text-gradient text-[40px] font-semibold w-[150px] text-end">{serialData}</div>
                                                        <div className="text-xl text-[#28293D] font-semibold ml-3">Kg</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-10'>

                                                <div className="mt-5">
                                                    <div className=" grid grid-cols-2 gap-5">
                                                        <div
                                                            className={`flex items-center rounded-lg px-2 py-3 gap-3 ${loadedScale > 0 ? 'bg-[#C9EEFA]' : ''}`}>
                                                            <div className="cursor-pointer" onClick={() => handleLoadedScale(serialData)}>
                                                                <img src="/images/can.png"
                                                                    className={'size-[80px] object-contain bg-[linear-gradient(180deg,_#A9EFF2_0%,_#3150A0_100%)] rounded'}
                                                                    alt="anh" />
                                                            </div>
                                                            <div className="">
                                                                <div className="text-base font-bold text-[#28293D]">Cân có tải</div>
                                                                <div className="flex items-end">
                                                                    <div
                                                                        className=" text-gradient text-[38px] font-semibold ms-5">{loadedScale}</div>
                                                                    <div className={'text-base ml-5 text-[#28293D] font-bold'}>Kg</div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div
                                                            className={`flex items-center rounded-lg px-2 py-3 gap-3 ${unLoadedScale > 0 ? 'bg-[#C9EEFA]' : ''}`}>
                                                            <div className="cursor-pointer"
                                                                onClick={() => handleUnLoadedScale(serialData)}
                                                            >
                                                                <img src="/images/can2.png"
                                                                    className={'size-[80px] px-2  object-contain bg-[linear-gradient(180deg,_#A9EFF2_0%,_#3150A0_100%)] rounded'}
                                                                    alt="anh" />
                                                            </div>
                                                            <div className="">
                                                                <div className="text-base font-bold text-[#28293D]">Cân không tải</div>
                                                                <div className="flex items-end">
                                                                    <div
                                                                        className=" text-gradient text-[38px] font-semibold ms-5">{unLoadedScale}</div>
                                                                    <div className={'text-base ml-5 text-[#28293D] font-bold'}>Kg</div>
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>



                                            </div>
                                        </div>


                                    </div>


                                    {
                                        electronic_scale_id === '' ? (
                                            <div className="flex justify-center mb-3 gap-3">
                                                <div
                                                    className="inline-block text-xl rounded-lg font-semibold text-white  bg-indigo-600 px-5 py-1 cursor-pointer select-none"
                                                    onClick={resetForm}>Phiếu mới
                                                </div>
                                                <div
                                                    onClick={handleStoreElectronicScale}
                                                    className="inline-block text-xl rounded-lg font-semibold text-white bg-[#E5D120] px-5 py-1 cursor-pointer select-none">Lưu
                                                    tạm
                                                </div>
                                            </div>

                                        ) : (
                                            <div className="flex justify-center mb-3 gap-3 ">
                                                <div
                                                    onClick={resetForm}
                                                    className="inline-block text-xl rounded-lg font-semibold text-white  bg-indigo-600 px-5 py-1 cursor-pointer select-none" >Phiếu
                                                    mới
                                                </div>
                                                <div
                                                    onClick={handleUpdateElectronicScale}
                                                    className="inline-block text-xl rounded-lg font-semibold text-white  bg-fuchsia-600 px-5 py-1 cursor-pointer select-none">Cập
                                                    nhật
                                                </div>

                                                {
                                                    unLoadedScale > 0 && dateUnLoadedScale !== '' && dateLoadedScale && tare && tare !== undefined && <div
                                                        onClick={() => complete_electronic_scale(electronic_scale_id)}
                                                        className="inline-block text-xl rounded-lg font-semibold text-white bg-[#13B42D] px-5 py-1 cursor-pointer select-none">Hoàn
                                                        thành
                                                    </div>
                                                }
                                                <div
                                                    onClick={() => handlePrint(
                                                        code_scale,
                                                        customerName,
                                                        licensePlates,
                                                        productName,
                                                        explain,
                                                        dateLoadedScale,
                                                        dateUnLoadedScale,
                                                        loadedScale,
                                                        unLoadedScale,
                                                        tare,
                                                        purpose_name,
                                                        total_weight

                                                    )}
                                                    className="inline-block text-xl rounded-lg font-semibold text-white bg-[#6E2323] px-5 py-1 cursor-pointer select-none">In
                                                </div>

                                            </div>

                                        )
                                    }


                                </div>


                            </div>

                        </div>
                      


                        <div className="my-10">
                            <div className="w-[70%] m-auto">
                                <div className="border py-1 px-2 rounded flex">
                                    <input type="search" className={'flex-grow text-sm  text-[#28293D] border-none  focus-visible:outline-none'}
                                        placeholder={'Nhập tên khách hàng, tên hàng, biển số xe,...'}
                                        value={key_search}
                                        onChange={(e) => setKeySearch(e.target.value)}
                                    />
                                    <div
                                        onClick={getDataElectronicScale}
                                        className="cursor-pointer bg-[#3C5EA7] text-sm text-white font-semibold px-2 py-1 rounded-lg">Tìm
                                        phiếu
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="p-5">
                            <div className="border rounded">
                                <div className="text-center py-2 text-[20px] font-semibold text-[#28293D] ">
                                    Danh sách tạm
                                </div>
                                <div className="">

                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead
                                                className="text-[#28293D] text-sm  bg-gray-50  ">
                                                <tr>
                                                    <th scope="col" className="p-4">
                                                        {/*<div className="flex items-center">*/}
                                                        {/*    <input id="checkbox-all-search" type="checkbox"*/}
                                                        {/*           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>*/}
                                                        {/*    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>*/}
                                                        {/*</div>*/}
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-nowrap">
                                                        Khách hàng
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-nowrap">
                                                        Tên hàng
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-nowrap">
                                                        Số xe
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-nowrap">
                                                        KL Có tải
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-nowrap">
                                                        KL Không tải
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-nowrap">
                                                        KL Hàng
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-nowrap">
                                                        KL Bì
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        <div className={'text-nowrap'}> Thời gian</div>
                                                        <div className={'text-nowrap'}> cân có tải</div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        <div className={'text-nowrap'}> Thời gian</div>
                                                        <div className={'text-nowrap'}>không tải</div>
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">

                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    listElectronicScale?.map((item, index) => (
                                                        <tr key={index}
                                                            onClick={() => {
                                                                handleDetail(item)
                                                                setElectronic_scale_id(item.id)
                                                            }}
                                                            className={`bg-white border-b text-gray-900 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 `}
                                                            style={{
                                                                backgroundColor: item.id === electronic_scale_id ? '#E5D120' : ''
                                                            }}>
                                                            <td className="w-4 p-4">
                                                                <div className="flex items-center">
                                                                    <input id="checkbox-table-search-1"
                                                                        type="checkbox"
                                                                        checked={electronic_scale_id === item?.id}
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                                    <label htmlFor="checkbox-table-search-1"
                                                                        className="sr-only">checkbox</label>
                                                                </div>
                                                            </td>
                                                            <th scope="row"
                                                                className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
                                                                {item?.supplier_name}
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                <div className="text-nowrap">
                                                                    {item?.product_name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-nowrap">
                                                                    {item?.license_plates}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item?.loaded_scale}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item?.unloaded_scale}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item?.tare}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {item?.total_weight}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-nowrap">  {item?.date_time_loaded_scale}</div>
                                                            </td>
                                                            <td className='px-6 py-4'>
                                                                <div className="text-nowrap">  {item?.date_time_unloaded_scale}</div>
                                                            </td>
                                                            <td className="flex items-center px-6 py-4">

                                                                {item?.unloaded_scale <= 0 ?
                                                                    (
                                                                        <div className="w-full text-center">
                                                                            <div
                                                                                className="bg-[#E5D120] text-white font-bold  text-nowrap px-2 py rounded text-xs cursor-pointer">Lưu
                                                                                tạm
                                                                            </div>
                                                                        </div>


                                                                    ) : (
                                                                        <div className="">
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
                                                                                    item?.date_time_loaded_scale,
                                                                                    item?.date_time_unloaded_scale,
                                                                                    item?.loaded_scale,
                                                                                    item?.unloaded_scale,
                                                                                    item?.tare,
                                                                                    item?.purpose_name,
                                                                                    item?.total_weight
                                                                                )}
                                                                                className="bg-[#6E2323] text-white font-bold text-nowrap px-2  rounded text-xs cursor-pointer mt-1 text-center">In
                                                                            </div>
                                                                        </div>

                                                                    )
                                                                }


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
                                    className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
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
                )
            }


        </React.Fragment >


    )
}
