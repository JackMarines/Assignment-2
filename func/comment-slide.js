const testimonials = [
  {
    text: "Lorem ipsum dolor sit amet consectetur. Eget pharetra et ipsum sem sagittis amet sagittis.",
    name: "John Doe",
    job: "CEO, Company Name",
    avatar: "https://i.pravatar.cc/100?img=32"
  },
  {
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    name: "Jane Smith",
    job: "Marketing Director",
    avatar: "https://i.pravatar.cc/100?img=47"
  },
  {
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    name: "Alex Brown",
    job: "Product Manager",
    avatar: "https://i.pravatar.cc/100?img=12"
  }
];

let index = 0;

const text = document.getElementById("text");
const name = document.getElementById("name");
const job = document.getElementById("job");
const avatar = document.getElementById("avatar");

function showTestimonial(i, direction = "right") {

  // xoá animation cũ
  text.classList.remove("fade-slide", "fade-slide-left");
  name.classList.remove("fade-slide", "fade-slide-left");
  job.classList.remove("fade-slide", "fade-slide-left");
  avatar.classList.remove("fade-slide", "fade-slide-left");

  // force reflow (để animation chạy lại)
  void text.offsetWidth;

  // đổi nội dung
  text.textContent = testimonials[i].text;
  name.textContent = testimonials[i].name;
  job.textContent = testimonials[i].job;
  avatar.src = testimonials[i].avatar;

  // thêm animation theo hướng
  const animClass =
    direction === "left" ? "fade-slide-left" : "fade-slide";

  text.classList.add(animClass);
  name.classList.add(animClass);
  job.classList.add(animClass);
  avatar.classList.add(animClass);
}

document.getElementById("next").onclick = () => {
  index = (index + 1) % testimonials.length;
  showTestimonial(index, "right");
};

document.getElementById("prev").onclick = () => {
  index = (index - 1 + testimonials.length) % testimonials.length;
  showTestimonial(index, "left");
};