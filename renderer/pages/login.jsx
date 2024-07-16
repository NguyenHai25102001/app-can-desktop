import Head from "next/head";
import React, { useState } from "react";
import { Toast } from "../components/uitli";
import { apis, request_url } from "../components/apis";
import { useRouter } from 'next/router';


const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (phone===undefined || password===undefined || phone==='' || password==='') {
            Toast({ type: 'warning', message: 'Vui lòng nhập đủ thông tin' });
            return;
        }

        try {
            const data = {
                user:phone,
                password:password,
            };
            const res = await request_url({
                url: apis.login(),
                method: 'POST',
                data: data,
            });
            console.log(data);

            if (res.status === true) {
                sessionStorage.setItem('token_customer', res.token);
                Toast({ type: 'success', message: 'Đăng nhập thành công' });
                router.push('/home');
                setPhone('')    // Reset phone
                setPassword('')  // Reset password

            }else {
                Toast({ type: 'error', message: 'Đăng nhập thất bại' });
            }
            console.log(res);
        } catch (e) {
            Toast({ type: 'error', message: 'Đăng nhập thất bại' });
        }
    };

    return (
        <>
            <Head>
                <title>Phần mềm cân WinGroup (tel:0354583367)</title>
                <link rel="icon" href="/images/icon.ico" /> {/* Đảm bảo đường dẫn chính xác tới tệp favicon */}
            </Head>

            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Đăng nhập vào tài khoản
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Tài khoản
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="number"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Mật khẩu
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
