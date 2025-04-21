import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Giới thiệu */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>GAMIFY STORE</h3>
            <p className="text-gray-300 leading-relaxed">
              Chúng tôi là cửa hàng chuyên cung cấp các sản phẩm game chất lượng cao, từ máy chơi game, phụ kiện đến các sản phẩm liên quan. Với đội ngũ nhân viên nhiệt tình và am hiểu về game, chúng tôi cam kết mang đến cho khách hàng những trải nghiệm mua sắm tốt nhất.
            </p>
          </div>

          {/* Liên hệ */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>LIÊN HỆ</h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                123 Đường ABC, Quận XYZ, TP.HCM
              </p>
              <p className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (028) 1234 5678
              </p>
              <p className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@gamifystore.com
              </p>
            </div>
          </div>

          {/* Giờ mở cửa */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>GIỜ MỞ CỬA</h3>
            <div className="space-y-2 text-gray-300">
              <p>Thứ 2 - Chủ nhật: 10:00 - 20:00</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2024 Gamify Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer