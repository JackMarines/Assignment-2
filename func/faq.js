document.querySelectorAll(".faq-col").forEach(col => {
    const items = col.querySelectorAll(".faq-item");

    items.forEach(item => {
      const btn = item.querySelector(".faq-question");

      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // đóng tất cả
        items.forEach(i => i.classList.remove("active"));

        // nếu item đang đóng → mở
        if (!isOpen) {
          item.classList.add("active");
        }
      });
    });
  });