# 🚀 SkillReformNG

🎓 **SkillReformNG** is a platform that connects Nigerians to verified training opportunities from NGOs, government agencies, and organizations.

## 🧠 Roles

- 👨‍💼 **Admin**: Approves trainings, manages users and the platform.
- 🧑‍🏫 **Trainer**: Lists trainings and manages applicants.
- 👨‍🎓 **Trainee**: Browses, applies, and tracks training opportunities.

---

## 🛠️ Features Implemented

- ✅ User registration & login with role selection
- ✅ Role-based access: Admin / Trainer / Trainee
- ✅ Email verification (📧 using Nodemailer + Ethereal)
- ✅ Training submission by Trainers (pending approval)
- ✅ Admin dashboard to approve/reject trainings
- ✅ Trainee applications to trainings
- ✅ Trainer dashboard to view their trainings & applicants
- ✅ Slug-based training URLs (e.g. `/trainings/ui-design-bootcamp`)

---

## 💻 Tech Stack

- Backend: **Node.js**, **Express.js**
- Database: **MongoDB** + Mongoose
- Email: **Nodemailer** + Ethereal (for testing)
- Auth: Role-based JWT authentication
- Frontend: Plain HTML/CSS for now (Wemi styling it 🎨)

---

## 🧪 Local Setup Instructions

### 1. ⚙️ Clone the Repo

```bash
git clone https://github.com/your-username/skillreformng.git
cd skillreformng
