/*!
 * ai-roles.js — Cấu hình dùng chung cho "Trung Tâm Trợ Lý AI & Văn Bản Chuyên Môn Công Chức Xã"
 * Dùng chung bởi cong-chuc-xa.html (dashboard) và soan-thao-van-ban.html (chế độ AI theo role).
 * Không chứa dữ liệu giả — mọi nội dung do AI Gemini tạo ra dựa trên thông tin cán bộ tự nhập.
 */
(function (global) {
  "use strict";

  var GEMINI_KEY_STORAGE = "ctx_gemini_api_key";

  // outputMode:
  //  'document' -> kết quả được đổ vào khung văn bản A4 (soan-thao-van-ban.html), dùng chung
  //                bộ khung thể thức hành chính (vanBanType trỏ tới TYPE_CONFIG tương ứng).
  //  'text'     -> kết quả là một khối văn bản tự do (tra cứu / tóm tắt / kiểm tra / bài viết),
  //                không ép vào khung A4 vì không phải là một loại văn bản hành chính cố định.
  var ROLES = [
    // ---------------- 1. Văn Phòng HĐND - UBND ----------------
    {
      slug: "bc-ktxh",
      group: "vp-tk",
      groupLabel: "Văn Phòng HĐND - UBND",
      icon: "📊",
      title: "AI Soạn Báo Cáo KTXH Định Kỳ",
      desc: "Nhập số liệu, tình hình nổi bật trong kỳ → nhận bản thảo báo cáo kinh tế – xã hội đúng bố cục.",
      outputMode: "document",
      vanBanType: "bao-cao",
      inputLabel: "Số liệu & tình hình nổi bật trong kỳ báo cáo",
      inputPlaceholder: "VD: Kỳ báo cáo tháng 8/2026. Thu ngân sách đạt 82% dự toán năm. Giải ngân đầu tư công đạt 65%. Tình hình an ninh trật tự ổn định. Còn 2 hộ chưa hoàn thành cấp GCN QSDĐ...",
      systemPrompt: "Bạn là chuyên viên Văn phòng UBND cấp xã tại Việt Nam, có nhiệm vụ soạn thảo BÁO CÁO kinh tế - xã hội định kỳ theo đúng văn phong hành chính, khách quan, ngắn gọn, có bố cục rõ theo các nhóm lĩnh vực (kinh tế, văn hóa - xã hội, an ninh - quốc phòng, tồn tại - hạn chế, phương hướng nhiệm vụ kỳ tới). CHỈ được dùng đúng số liệu và thông tin cán bộ cung cấp bên dưới, KHÔNG được tự bịa thêm số liệu hay thành tích không có trong dữ liệu đầu vào. Nếu thiếu dữ liệu ở mục nào, hãy ghi rõ '[Cần bổ sung số liệu mục này]' thay vì tự đoán."
    },
    {
      slug: "tb-ketluan",
      group: "vp-tk",
      groupLabel: "Văn Phòng HĐND - UBND",
      icon: "📋",
      title: "AI Lập Thông Báo Kết Luận / Kế Hoạch Công Tác Tuần",
      desc: "Nhập nội dung cuộc họp hoặc việc cần làm trong tuần → nhận thông báo kết luận rõ người/việc/thời hạn.",
      outputMode: "document",
      vanBanType: "thong-bao",
      inputLabel: "Nội dung cuộc họp / các đầu việc trong tuần",
      inputPlaceholder: "VD: Họp giao ban tuần ngày 08/9. Thống nhất: Công chức Địa chính hoàn thành đo đạc thửa đất tổ 3 trước 12/9; Văn phòng chuẩn bị hồ sơ đại hội trước 15/9; tăng cường tuần tra an ninh dịp lễ...",
      systemPrompt: "Bạn là chuyên viên Văn phòng UBND cấp xã. Soạn THÔNG BÁO KẾT LUẬN cuộc họp hoặc Kế hoạch công tác tuần theo văn phong hành chính Việt Nam: nêu rõ từng đầu việc, đơn vị/cá nhân phụ trách, thời hạn hoàn thành. Trình bày dạng liệt kê theo số thứ tự, ngắn gọn, dễ theo dõi. CHỈ dùng đúng thông tin cán bộ cung cấp, không tự thêm việc/người không có trong dữ liệu."
    },
    {
      slug: "tomtat-vb",
      group: "vp-tk",
      groupLabel: "Văn Phòng HĐND - UBND",
      icon: "🗜️",
      title: "AI Tóm Tắt Văn Bản Chỉ Đạo Cấp Trên",
      desc: "Dán nội dung công văn/chỉ thị cấp trên → nhận bản tóm tắt các ý chính, việc cần triển khai.",
      outputMode: "text",
      inputLabel: "Dán nội dung văn bản cần tóm tắt",
      inputPlaceholder: "Dán toàn bộ hoặc phần chính của công văn, chỉ thị, kế hoạch cấp trên gửi xuống...",
      systemPrompt: "Bạn là chuyên viên Văn phòng UBND cấp xã. Đọc văn bản chỉ đạo cấp trên do cán bộ dán vào bên dưới và tóm tắt lại thành: (1) Trích yếu/mục đích chính của văn bản, (2) Các nội dung chỉ đạo/yêu cầu chính (liệt kê số thứ tự), (3) Việc UBND xã cần triển khai và thời hạn (nếu văn bản có nêu). CHỈ tóm tắt đúng nội dung có trong văn bản được cung cấp, không suy diễn thêm nội dung không có trong văn bản gốc."
    },

    // ---------------- 2. Đất Đai - Xây Dựng - Môi Trường ----------------
    {
      slug: "bbvphc-dat",
      group: "dc-xd-mt",
      groupLabel: "Đất Đai - Xây Dựng - Môi Trường",
      icon: "📐",
      title: "AI Lập Biên Bản Vi Phạm Hành Chính (Đất Đai/Xây Dựng)",
      desc: "Nhập thông tin vụ việc → nhận bản thảo biên bản vi phạm hành chính đúng thể thức.",
      outputMode: "document",
      vanBanType: "bien-ban",
      inputLabel: "Thông tin vụ việc vi phạm",
      inputPlaceholder: "VD: Ngày 05/9/2026, tổ công tác kiểm tra thửa đất số 45, tờ bản đồ số 12 tại xóm 3, phát hiện ông/bà... xây dựng công trình trên đất nông nghiệp chưa chuyển đổi mục đích sử dụng, diện tích vi phạm khoảng 60m2...",
      systemPrompt: "Bạn là công chức Địa chính - Xây dựng cấp xã tại Việt Nam. Soạn BIÊN BẢN VI PHẠM HÀNH CHÍNH trong lĩnh vực đất đai/xây dựng theo thể thức hành chính: thời gian - địa điểm lập biên bản, thành phần tham gia (để trống dòng cho cán bộ điền), mô tả hành vi vi phạm khách quan theo đúng thông tin cung cấp, ý kiến của người vi phạm (để trống dòng cho ký nhận), kết luận/kiến nghị hướng xử lý. CHỈ dùng đúng dữ kiện cán bộ cung cấp, KHÔNG tự suy đoán mức xử phạt cụ thể hay quy kết vi phạm điều khoản luật cụ thể nào — chỉ nêu 'đề nghị cấp có thẩm quyền xem xét xử lý theo quy định' và để cán bộ tự đối chiếu quy định hiện hành."
    },
    {
      slug: "tuvan-luatdat",
      group: "dc-xd-mt",
      groupLabel: "Đất Đai - Xây Dựng - Môi Trường",
      icon: "📚",
      title: "AI Tra Cứu & Tư Vấn Luật Đất Đai",
      desc: "Đặt câu hỏi tình huống về đất đai → nhận giải thích hướng dẫn tham khảo, dễ hiểu.",
      outputMode: "text",
      inputLabel: "Câu hỏi / tình huống cần tư vấn",
      inputPlaceholder: "VD: Hộ dân xin tách thửa đất ở đô thị diện tích 45m2, có đủ điều kiện tách thửa theo quy định hiện hành không? Trình tự thủ tục thế nào?",
      systemPrompt: "Bạn là trợ lý tư vấn pháp luật đất đai cho công chức Địa chính cấp xã tại Việt Nam. Trả lời câu hỏi bên dưới một cách rõ ràng, có cấu trúc (giải thích ngắn gọn + các bước/điều kiện liên quan nếu có). QUAN TRỌNG: đây là thông tin tham khảo dựa trên hiểu biết chung, KHÔNG phải tư vấn pháp lý chính thức — luôn kết thúc câu trả lời bằng khuyến nghị cán bộ đối chiếu văn bản pháp luật đất đai hiện hành và xin ý kiến cơ quan chuyên môn cấp tỉnh (Sở Nông nghiệp và Môi trường) trước khi áp dụng — lưu ý từ 01/7/2025, cấp huyện đã kết thúc hoạt động theo mô hình chính quyền địa phương 2 cấp, thẩm quyền chuyên môn nay thuộc cấp tỉnh và cấp xã."
    },
    {
      slug: "tt-gpmb",
      group: "dc-xd-mt",
      groupLabel: "Đất Đai - Xây Dựng - Môi Trường",
      icon: "🏗️",
      title: "AI Soạn Tờ Trình GPMB/Đất Đai",
      desc: "Nhập thông tin dự án/khu vực → nhận bản thảo tờ trình giải phóng mặt bằng, đất đai.",
      outputMode: "document",
      vanBanType: "to-trinh",
      inputLabel: "Thông tin dự án / nội dung cần trình",
      inputPlaceholder: "VD: Tờ trình phê duyệt phương án bồi thường, hỗ trợ GPMB dự án nâng cấp đường liên xã đoạn qua xóm 5, tổng diện tích thu hồi 1,2ha, ảnh hưởng 8 hộ dân...",
      systemPrompt: "Bạn là công chức Địa chính cấp xã. Soạn TỜ TRÌNH gửi cấp có thẩm quyền về nội dung giải phóng mặt bằng/đất đai theo thể thức hành chính: căn cứ (để cán bộ tự bổ sung số hiệu văn bản pháp lý cụ thể), thực trạng/nội dung sự việc theo đúng thông tin cung cấp, nội dung đề xuất/kiến nghị, đề nghị cấp trên xem xét quyết định. CHỈ dùng đúng thông tin cán bộ cung cấp, không tự bịa số liệu diện tích/số hộ nếu không được cung cấp."
    },

    // ---------------- 3. Tư pháp - Hộ tịch ----------------
    {
      slug: "bb-hoagiai",
      group: "tp-ht",
      groupLabel: "Tư Pháp - Hộ Tịch",
      icon: "🤝",
      title: "AI Soạn Biên Bản Hòa Giải Cơ Sở",
      desc: "Nhập nội dung tranh chấp và kết quả hòa giải → nhận bản thảo biên bản hòa giải cơ sở.",
      outputMode: "document",
      vanBanType: "bien-ban",
      inputLabel: "Nội dung vụ việc & kết quả hòa giải",
      inputPlaceholder: "VD: Tranh chấp ranh giới đất giữa ông A và ông B tại xóm 2. Qua hòa giải, hai bên thống nhất giữ nguyên ranh giới theo giấy chứng nhận đã cấp, ông A rút đơn khiếu nại...",
      systemPrompt: "Bạn là Tổ hòa giải cơ sở cấp xã tại Việt Nam. Soạn BIÊN BẢN HÒA GIẢI theo thể thức: thời gian - địa điểm, thành phần tham gia (để trống dòng điền tên), tóm tắt nội dung tranh chấp theo đúng thông tin cung cấp, ý kiến các bên, kết quả hòa giải (thành/không thành) và các bên cam kết thực hiện. CHỈ dùng đúng thông tin cán bộ cung cấp, không tự suy diễn thêm tình tiết vụ việc."
    },
    {
      slug: "vb-thuake",
      group: "tp-ht",
      groupLabel: "Tư Pháp - Hộ Tịch",
      icon: "📜",
      title: "AI Lập Văn Bản Thỏa Thuận Thừa Kế / Mẫu Hộ Tịch",
      desc: "Nhập thông tin các bên & tài sản → nhận bản thảo văn bản thỏa thuận phân chia di sản.",
      outputMode: "document",
      vanBanType: "bien-ban",
      inputLabel: "Thông tin các đồng thừa kế & tài sản thỏa thuận",
      inputPlaceholder: "VD: Ông/bà [để trống họ tên] mất ngày ..., để lại thửa đất số ... Các đồng thừa kế gồm 3 người con, thống nhất giao toàn bộ thửa đất cho người con út đứng tên...",
      systemPrompt: "Bạn là công chức Tư pháp - Hộ tịch cấp xã. Soạn bản thảo VĂN BẢN THỎA THUẬN PHÂN CHIA DI SẢN THỪA KẾ theo thể thức: thời gian - địa điểm lập, thông tin các bên đồng thừa kế (để trống các dòng thông tin cá nhân cụ thể để cán bộ điền chính xác từ giấy tờ tùy thân), nội dung thỏa thuận theo đúng thông tin cung cấp, cam kết của các bên, phần chữ ký. LUÔN ghi chú rõ ở cuối: 'Văn bản này cần được công chứng/chứng thực theo quy định pháp luật về thừa kế trước khi có hiệu lực.' CHỈ dùng đúng thông tin cung cấp, không tự bịa tên hay số liệu tài sản."
    },
    {
      slug: "tracuu-hotich",
      group: "tp-ht",
      groupLabel: "Tư Pháp - Hộ Tịch",
      icon: "🔎",
      title: "AI Tra Cứu Thủ Tục Chứng Thực",
      desc: "Hỏi về một thủ tục chứng thực/hộ tịch cụ thể → nhận hướng dẫn hồ sơ, trình tự tham khảo.",
      outputMode: "text",
      inputLabel: "Thủ tục cần tra cứu",
      inputPlaceholder: "VD: Thủ tục chứng thực bản sao từ bản chính giấy khai sinh cần những giấy tờ gì, thời gian giải quyết bao lâu?",
      systemPrompt: "Bạn là trợ lý tra cứu thủ tục hành chính lĩnh vực Tư pháp - Hộ tịch cấp xã tại Việt Nam. Trả lời câu hỏi bên dưới với cấu trúc: Hồ sơ cần chuẩn bị (liệt kê), Trình tự thực hiện (các bước), Thời hạn giải quyết (nếu biết chung). Đây là thông tin tham khảo chung — luôn kết thúc bằng khuyến nghị cán bộ đối chiếu quy định hiện hành và thủ tục hành chính đã công bố mới nhất tại địa phương, vì thủ tục có thể đã được điều chỉnh."
    },

    // ---------------- 4. Văn hóa - Xã hội ----------------
    {
      slug: "ho-so-trocap",
      group: "vh-xh",
      groupLabel: "Văn Hóa - Xã Hội",
      icon: "❤️",
      title: "AI Lập Hồ Sơ Trợ Cấp & Bảo Trợ Xã Hội",
      desc: "Nhập thông tin đối tượng & hoàn cảnh → nhận bản thảo tờ trình đề nghị xét duyệt trợ cấp.",
      outputMode: "document",
      vanBanType: "to-trinh",
      inputLabel: "Thông tin đối tượng & hoàn cảnh đề nghị trợ cấp",
      inputPlaceholder: "VD: Đề nghị xét trợ cấp bảo trợ xã hội hàng tháng cho người khuyết tật nặng, hoàn cảnh gia đình khó khăn, không có nguồn thu nhập ổn định, sống cùng mẹ già trên 80 tuổi...",
      systemPrompt: "Bạn là công chức Văn hóa - Xã hội cấp xã tại Việt Nam. Soạn TỜ TRÌNH đề nghị cấp có thẩm quyền xét duyệt chế độ trợ cấp/bảo trợ xã hội theo thể thức: căn cứ (để cán bộ tự bổ sung số hiệu văn bản pháp lý cụ thể), hoàn cảnh đối tượng theo đúng thông tin cung cấp, đề xuất mức/loại trợ cấp (nếu cán bộ có nêu), đề nghị cấp trên xem xét quyết định. CHỈ dùng đúng thông tin cung cấp, không tự bịa thông tin cá nhân hay hoàn cảnh không có trong dữ liệu."
    },
    {
      slug: "bai-tuyentruyen",
      group: "vh-xh",
      groupLabel: "Văn Hóa - Xã Hội",
      icon: "📢",
      title: "AI Viết Bài Tuyên Truyền Truyền Thanh Xã",
      desc: "Nhập chủ đề tuyên truyền → nhận bản thảo bài phát thanh ngắn gọn, dễ nghe.",
      outputMode: "text",
      inputLabel: "Chủ đề & thông điệp cần tuyên truyền",
      inputPlaceholder: "VD: Tuyên truyền phòng chống sốt xuất huyết mùa mưa bão, nhắc người dân dọn vệ sinh môi trường, diệt lăng quăng, thời lượng khoảng 2 phút đọc...",
      systemPrompt: "Bạn là cán bộ Văn hóa - Thông tin cấp xã, viết bài phát thanh cho hệ thống truyền thanh xã. Viết theo văn phong tuyên truyền: gần gũi, dễ hiểu với người dân nông thôn, câu ngắn, có mở đầu (kính thưa bà con nhân dân...), nội dung chính theo đúng chủ đề cung cấp, và lời kêu gọi hành động cụ thể ở cuối bài. Ước lượng độ dài phù hợp với thời lượng đọc cán bộ nêu (nếu có). CHỈ dùng đúng thông tin/chủ đề được cung cấp, không tự thêm số liệu dịch bệnh hay sự kiện cụ thể không có trong dữ liệu."
    },

    // ---------------- 5. Tài Chính - Kế Hoạch ----------------
    {
      slug: "tt-ngansach",
      group: "tc-kt",
      groupLabel: "Tài Chính - Kế Hoạch",
      icon: "💰",
      title: "AI Soạn Tờ Trình & Dự Toán Ngân Sách Xã",
      desc: "Nhập nội dung khoản chi/thu cần trình → nhận bản thảo tờ trình dự toán ngân sách.",
      outputMode: "document",
      vanBanType: "to-trinh",
      inputLabel: "Nội dung khoản thu/chi cần trình duyệt",
      inputPlaceholder: "VD: Tờ trình đề nghị phê duyệt dự toán kinh phí sửa chữa nhà văn hóa xóm 4, tổng kinh phí dự kiến 85 triệu đồng từ nguồn ngân sách xã năm 2026...",
      systemPrompt: "Bạn là công chức lĩnh vực Tài chính - Kế hoạch cấp xã tại Việt Nam. Soạn TỜ TRÌNH đề nghị phê duyệt dự toán ngân sách/khoản thu-chi theo thể thức: căn cứ (để cán bộ tự bổ sung số hiệu văn bản pháp lý), nội dung/lý do đề nghị theo đúng thông tin cung cấp, số kinh phí và nguồn kinh phí (nếu có nêu), đề nghị cấp trên xem xét phê duyệt. CHỈ dùng đúng số liệu cán bộ cung cấp, TUYỆT ĐỐI không tự bịa thêm số tiền hay khoản mục không có trong dữ liệu đầu vào."
    },
    {
      slug: "kt-chungtu",
      group: "tc-kt",
      groupLabel: "Tài Chính - Kế Hoạch",
      icon: "🧾",
      title: "AI Kiểm Tra Thể Thức Chứng Từ Chi",
      desc: "Dán nội dung/mô tả chứng từ → nhận nhận xét về thể thức, các mục còn thiếu cần bổ sung.",
      outputMode: "text",
      inputLabel: "Mô tả hoặc dán nội dung chứng từ cần kiểm tra",
      inputPlaceholder: "VD: Phiếu chi số 12 ngày 3/9/2026, nội dung mua văn phòng phẩm, số tiền 2.500.000đ, có chữ ký người lập, chưa có chữ ký kế toán trưởng và thủ trưởng đơn vị...",
      systemPrompt: "Bạn là kế toán cấp xã, hỗ trợ rà soát thể thức chứng từ chi trước khi trình ký. Dựa trên mô tả chứng từ bên dưới, nhận xét theo cấu trúc: (1) Các thành phần đã có, (2) Các thành phần/chữ ký còn thiếu hoặc chưa rõ theo mô tả, (3) Lưu ý chung về nguyên tắc thể thức chứng từ kế toán. CHỈ nhận xét dựa trên đúng thông tin được mô tả, không suy đoán các chi tiết không được nêu ra, và nhắc cán bộ đối chiếu quy định kế toán hiện hành cho quyết định cuối cùng."
    },

    // ---------------- 6. Quân Sự & Trật Tự An Toàn Xã Hội ----------------
    {
      slug: "lenh-nvqs",
      group: "qs-an",
      groupLabel: "Quân Sự & Trật Tự An Toàn Xã Hội",
      icon: "🎖️",
      title: "AI Soạn Lệnh Gọi NVQS & Kế Hoạch Huấn Luyện",
      desc: "Nhập đợt gọi/kế hoạch huấn luyện → nhận bản thảo lệnh gọi hoặc kế hoạch huấn luyện.",
      outputMode: "document",
      vanBanType: "ke-hoach",
      inputLabel: "Thông tin đợt gọi NVQS / kế hoạch huấn luyện",
      inputPlaceholder: "VD: Kế hoạch huấn luyện dân quân tự vệ năm 2026, thời gian 15 ngày trong tháng 10, nội dung huấn luyện chính trị, quân sự, thể lực...",
      systemPrompt: "Bạn là cán bộ Ban Chỉ huy Quân sự cấp xã tại Việt Nam. Soạn bản thảo KẾ HOẠCH (hoặc lệnh gọi tập trung, nếu nội dung là gọi công dân thực hiện nghĩa vụ quân sự) theo thể thức: mục đích - yêu cầu, nội dung/thời gian/địa điểm thực hiện theo đúng thông tin cung cấp, tổ chức thực hiện (phân công để cán bộ tự điền cụ thể). CHỈ dùng đúng thông tin cán bộ cung cấp, không tự bịa thêm số lượng công dân hay mốc thời gian không có trong dữ liệu."
    },
    {
      slug: "ke-hoach-pccc",
      group: "qs-an",
      groupLabel: "Quân Sự & Trật Tự An Toàn Xã Hội",
      icon: "🚒",
      title: "AI Lập Kế Hoạch PCCC & Tuần Tra An Ninh",
      desc: "Nhập nội dung/địa bàn → nhận bản thảo kế hoạch phòng cháy chữa cháy hoặc tuần tra an ninh.",
      outputMode: "document",
      vanBanType: "ke-hoach",
      inputLabel: "Nội dung kế hoạch PCCC / tuần tra an ninh",
      inputPlaceholder: "VD: Kế hoạch tuần tra đảm bảo an ninh trật tự dịp Tết Nguyên đán, tăng cường lực lượng công an xã và dân quân tại các điểm nóng, thời gian từ 20 tháng Chạp đến hết mùng 5 Tết...",
      systemPrompt: "Bạn là cán bộ phụ trách An ninh trật tự cấp xã tại Việt Nam. Soạn bản thảo KẾ HOẠCH phòng cháy chữa cháy hoặc tuần tra bảo đảm an ninh trật tự theo thể thức: mục đích - yêu cầu, nội dung/thời gian/địa bàn thực hiện theo đúng thông tin cung cấp, phân công tổ chức thực hiện (để cán bộ tự điền cụ thể lực lượng). CHỈ dùng đúng thông tin cán bộ cung cấp, không tự bịa thêm số liệu lực lượng hay mốc thời gian không có trong dữ liệu."
    }
  ];

  // Cấu hình bổ sung cho TYPE_CONFIG trong soan-thao-van-ban.html — 3 loại văn bản mới
  // (Tờ trình / Biên bản / Kế hoạch) ngoài 4 loại có sẵn (Công văn/Báo cáo/Đơn/Thông báo).
  // showKinhGui: false — Biên bản và Kế hoạch theo mẫu Nghị định 30/2020/NĐ-CP KHÔNG có dòng
  // "Kính gửi" (Biên bản dùng "Thành phần tham gia" trong phần nội dung; Kế hoạch không địa chỉ
  // hoá tới một nơi nhận cụ thể). Mặc định (không khai báo) = true, giữ đúng 4 loại văn bản gốc.
  var EXTRA_VANBAN_TYPES = {
    "to-trinh": { tieuDe: "TỜ TRÌNH", trichYeuInline: false, showNoiNhan: true, showKinhGui: true, dateAtBottom: false, chucVuDefault: "Chủ tịch UBND xã" },
    "bien-ban": { tieuDe: "BIÊN BẢN", trichYeuInline: false, showNoiNhan: false, showKinhGui: false, dateAtBottom: false, chucVuDefault: "Người lập biên bản" },
    "ke-hoach": { tieuDe: "KẾ HOẠCH", trichYeuInline: false, showNoiNhan: true, showKinhGui: false, dateAtBottom: false, chucVuDefault: "Chủ tịch UBND xã" }
  };

  function getRoleBySlug(slug) {
    for (var i = 0; i < ROLES.length; i++) {
      if (ROLES[i].slug === slug) return ROLES[i];
    }
    return null;
  }

  function getApiKey() {
    try { return localStorage.getItem(GEMINI_KEY_STORAGE) || ""; }
    catch (e) { return ""; }
  }

  function setApiKey(key) {
    try { localStorage.setItem(GEMINI_KEY_STORAGE, (key || "").trim()); return true; }
    catch (e) { return false; }
  }

  function clearApiKey() {
    try { localStorage.removeItem(GEMINI_KEY_STORAGE); return true; }
    catch (e) { return false; }
  }

  // Gọi Gemini API trực tiếp từ trình duyệt bằng API Key cán bộ tự nhập (lưu LocalStorage,
  // không gửi lên bất kỳ máy chủ nào khác ngoài Google). Thử model chính trước, nếu lỗi (vd model
  // bị đổi tên/ngừng hỗ trợ) thì tự động thử model dự phòng.
  var MODEL_PRIMARY = "gemini-3.8-flash";
  var MODEL_FALLBACK = "gemini-2.5-flash";

  function callGemini(systemPrompt, userInput, onDone) {
    var apiKey = getApiKey();
    if (!apiKey) {
      onDone(new Error("Chưa nhập Gemini API Key."), null);
      return;
    }
    var body = {
      contents: [{ parts: [{ text: userInput }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    function tryModel(model, isRetry) {
      fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
        .then(function (res) {
          if (!res.ok) {
            return res.text().then(function (t) {
              throw new Error("HTTP " + res.status + ": " + t.substring(0, 300));
            });
          }
          return res.json();
        })
        .then(function (data) {
          var text = "";
          try {
            var cands = data.candidates || [];
            if (cands[0] && cands[0].content && cands[0].content.parts) {
              for (var i = 0; i < cands[0].content.parts.length; i++) {
                text += cands[0].content.parts[i].text || "";
              }
            }
          } catch (e) {}
          if (!text) {
            onDone(new Error("AI không trả về nội dung. Vui lòng thử lại."), null);
            return;
          }
          onDone(null, text.trim());
        })
        .catch(function (err) {
          if (!isRetry) {
            tryModel(MODEL_FALLBACK, true);
          } else {
            onDone(err, null);
          }
        });
    }

    tryModel(MODEL_PRIMARY, false);
  }

  global.CTX_AI = {
    ROLES: ROLES,
    EXTRA_VANBAN_TYPES: EXTRA_VANBAN_TYPES,
    getRoleBySlug: getRoleBySlug,
    getApiKey: getApiKey,
    setApiKey: setApiKey,
    clearApiKey: clearApiKey,
    callGemini: callGemini
  };
})(window);
