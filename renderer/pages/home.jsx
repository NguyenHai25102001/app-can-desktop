import React, {useEffect, useState} from 'react'
import Head from 'next/head';
import Link from "next/link";


export default function HomePage() {
    const [serialData, setSerialData] = useState('');
    useEffect(() => {

        window.ipc.onSerialData((data) => {
            setSerialData(data);
        });
    }, []);
    return (
        <React.Fragment>
            <Head>
                <title>Phần mềm cân WinGroup (tel:0354583367)</title>
                <link rel="icon" href="/images/icon.ico"/>
            </Head>
            <div className="fixed h-[70px] bg-[#203DA4] w-full text-[#FFFFFF] z-10">
                <div className="flex items-center justify-between px-10 h-full">
                    <div className="flex gap-3 items-center">
                        <div className="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="34" viewBox="0 0 41 34"
                                 fill="none">
                                <path
                                    d="M0 22.0934C0 19.653 1.97831 17.6747 4.41867 17.6747H11.2922C13.7325 17.6747 15.7108 19.653 15.7108 22.0934V28.9669C15.7108 31.4072 13.7325 33.3855 11.2922 33.3855H4.41867C1.97831 33.3855 0 31.4072 0 28.9669V22.0934Z"
                                    fill="white"/>
                                <path
                                    d="M23.5663 20.1295C22.7528 20.1295 22.0934 20.789 22.0934 21.6024C22.0934 22.4159 22.7528 23.0753 23.5663 23.0753H33.3855C34.199 23.0753 34.8584 22.4159 34.8584 21.6024C34.8584 20.789 34.199 20.1295 33.3855 20.1295H23.5663Z"
                                    fill="white"/>
                                <path
                                    d="M39.2771 27.9849H23.5663C22.7528 27.9849 22.0934 28.6444 22.0934 29.4578C22.0934 30.2713 22.7528 30.9307 23.5663 30.9307H39.2771C40.0906 30.9307 40.75 30.2713 40.75 29.4578C40.75 28.6444 40.0906 27.9849 39.2771 27.9849Z"
                                    fill="white"/>
                                <path
                                    d="M0 3.92771C0 1.7585 1.7585 0 3.92771 0H35.3494C37.5186 0 39.2771 1.7585 39.2771 3.92771V9.81928C39.2771 11.9885 37.5186 13.747 35.3494 13.747H3.92771C1.7585 13.747 0 11.9885 0 9.81928V3.92771Z"
                                    fill="white"/>
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
                <div className="w-[80%] m-auto border-2 rounded-lg mt-5 relative">
                    <div className="p-5 border-b-2">
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-semibold text-[#28293D">Phiếu Cân</div>
                            <div className="">
                                <select className={'bg-[#06C270] text-white text-sm font-bold px-2 py-1 rounded'}>
                                    <option value="1">Có Tải trọng</option>
                                    <option value="2">Có Tải trọng</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-3 gap-5">
                            <div className="">
                                <div className="text-base text-[#28293D] font-semibold">Ngày cân</div>
                                <div
                                    className="mt-2 border w-full text-center py-2 rounded text-sm font-bold text-[#5C64D0] h-[35px]">
                                    08:30:30 19/06/2024
                                </div>
                            </div>

                            <div className="">
                                <div className="text-base text-[#28293D] font-semibold">Số xe</div>
                                <input type="text" value={'29l - 88866'}
                                       className={'mt-2 h-[35px] w-full border text-center py-2 rounded text-sm font-bold text-[#5C64D0]'}/>
                            </div>

                            <div className="">
                                <div className="text-base text-[#28293D] font-semibold">Khách hàng</div>
                                <input type="text"
                                       value={"Nguyễn Văn A"}
                                       className={'mt-2 border h-[35px] w-full text-center py-2 rounded text-sm font-bold text-[#5C64D0]'}/>
                            </div>

                            <div className="">
                                <div className="text-base text-[#28293D] font-semibold">Tên hàng</div>
                                <input type="text"
                                       value={"Lúa con cò vụ đông xuân"}
                                       className={'mt-2 border h-[35px] text-center py-2 rounded text-sm font-bold text-[#5C64D0] w-full'}/>
                            </div>

                            <div className="">
                                <div className="text-base text-[#28293D] font-semibold">Trạng thái cân</div>

                                <select
                                    className={'mt-2 border h-[35px] w-full text-center py-2 rounded text-sm font-bold text-[#5C64D0]'}>
                                    <option value="1">PHIẾU NHẬP</option>
                                    <option value="2">PHIẾU NHẬP</option>
                                </select>
                            </div>
                            <div className=""></div>

                        </div>

                        <div className="mt-5">
                            <div className=" grid grid-cols-2 gap-5">
                                <div className="flex items-center bg-[#C9EEFA] rounded-lg px-2 py-3 gap-3">
                                    <div className="">
                                        <img src="/images/can.png"
                                             className={'size-[80px] object-contain bg-[linear-gradient(180deg,_#A9EFF2_0%,_#3150A0_100%)] rounded'}
                                             alt="anh"/>
                                    </div>
                                    <div className="">
                                        <div className="text-base font-bold text-[#28293D]">Cân có tải</div>
                                        <div className="flex items-end">
                                            <div className=" text-gradient text-[38px] font-semibold ms-5">2370

                                            </div>
                                            <div className={'text-base ml-5 text-[#28293D] font-bold'}>Kg</div>
                                        </div>

                                    </div>

                                </div>
                                <div className="flex items-center border rounded-lg px-2 py-3 gap-3">
                                    <div className="">
                                        <img src="/images/can2.png"
                                             className={'size-[80px] px-2  object-contain bg-[linear-gradient(180deg,_#A9EFF2_0%,_#3150A0_100%)] rounded'}
                                             alt="anh"/>
                                    </div>
                                    <div className="">
                                        <div className="text-base font-bold text-[#28293D]">Cân không tải</div>
                                        <div className="flex items-end">
                                            <div className=" text-gradient text-[38px] font-semibold ms-5">2370

                                            </div>
                                            <div className={'text-base ml-5 text-[#28293D] font-bold'}>Kg</div>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className="text-center mt-14">
                            <div
                                className="inline-block text-2xl rounded-lg font-semibold text-white bg-[#E5D120] px-5 py-1 cursor-pointer select-none">Lưu
                                Tạm
                            </div>

                        </div>

                    </div>
                    <div className="absolute bottom-0 right-0 py-2 px-3 bg-[#E5D120] text-center rounded-tl-3xl ">
                        <div className="text-base text-[#28293D] font-semibold">Trọng lượng</div>
                        <div className="flex items-end justify-center">
                            <div className="text-gradient text-[40px] font-semibold w-[150px] text-end">{serialData}</div>
                            <div className="text-xl text-[#28293D] font-semibold ml-3">Kg</div>
                        </div>
                    </div>

                </div>

            </div>

            <div className="my-10">
                <div className="w-[70%] m-auto">
                    <div className="border py-1 px-2 rounded flex">
                        <input type="text" className={'flex-grow text-sm  text-[#28293D] border-none'}
                               placeholder={'Nhập tên khách hàng, tên hàng, biển số xe,...'}
                        />
                        <div
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
                                    <th scope="col" className="px-6 py-3 text-nowrap" >
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
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input id="checkbox-table-search-1" type="checkbox"
                                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="checkbox-table-search-1"
                                                   className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Apple MacBook Pro 17"
                                    </th>
                                    <td className="px-6 py-4">
                                        Silver
                                    </td>
                                    <td className="px-6 py-4">
                                        Laptop
                                    </td>
                                    <td className="px-6 py-4">
                                        Yes
                                    </td>
                                    <td className="px-6 py-4">
                                        Yes
                                    </td>
                                    <td className="px-6 py-4">
                                        $2999
                                    </td>
                                    <td className="px-6 py-4">
                                        3.0 lb.
                                    </td>
                                    <td className="flex items-center px-6 py-4">
                                        <a href="#"
                                           className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        <a href="#"
                                           className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</a>
                                    </td>
                                    <td>ghjk</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <div className="py-14"></div>

        </React.Fragment>
    )
}
