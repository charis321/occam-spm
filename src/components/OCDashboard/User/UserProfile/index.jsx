
import { useState, useEffect } from 'react'
import { User, Mail, School, BookOpen, Calendar, ShieldCheck } from 'lucide-react';



export default function OCUserProfile(props){
    const { data } = props;
    const getRoleName = (role) => (role === 1 ? '學生' : '教職員');
    const getSexName = (sex) => (sex === 1 ? '男' : '女');
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('zh-TW');
    useEffect(()=>{
      console.log('user profile data:', data)
    }, [data])
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* 頂部標題區 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">個人資訊中心</h1>
        <p className="text-gray-500">管理您的帳號設定與基本資料</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左側頭像卡片 */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <User size={48} className="text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{data.name}</h2>
          <span className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full font-medium">
            {getRoleName(data.role)}
          </span>
          <div className="mt-6 w-full pt-6 border-t border-gray-100">
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <ShieldCheck size={16} className="mr-2" />
              <span>狀態：{data.status === 0 ? '啟用中' : '停用'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={16} className="mr-2" />
              <span>加入時間：{formatDate(data.createTime)}</span>
            </div>
          </div>
        </div>

        {/* 右側詳細資料 */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-medium text-gray-800 mb-6 border-b pb-2">基本資料</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              <InfoItem icon={<Mail size={18}/>} label="電子郵件" value={data.email} />
              <InfoItem icon={<User size={18}/>} label="性別" value={getSexName(data.sex)} />
              <InfoItem icon={<School size={18}/>} label="就讀學校" value={data.school} />
              <InfoItem icon={<BookOpen size={18}/>} label="所屬系所" value={data.department} />
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                編輯個人資料
              </button>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-400">
            帳號唯一識別碼: {data.id} | 最後更新於: {new Date(data.updateTime).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// 輔助組件：資訊條目
const InfoItem = (props)=>{
   const {icon, label, value } = props;
  <div className="flex items-start">
    <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400 mb-0.5">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
};

