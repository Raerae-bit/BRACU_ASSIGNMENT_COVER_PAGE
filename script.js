
const fields = [
    ["department", "previewDepartment", "Department Name"],
    ["assignmentTitle", "previewTitle", "Assignment Title"],
    ["courseCode", "previewCode", "Course Code"],
    ["courseTitle", "previewCourse", "Course Title"],
    ["studentName", "previewName", "Student Name"],
    ["studentId", "previewId", "Student ID"],
    ["section", "previewSection", "—"],
    ["facultyName", "previewFaculty", "Faculty Name"],
    ["designation", "previewDesignation", "Designation"]
];

// Update the cover whenever the user types.
fields.forEach(([inputId, previewId, placeholder]) => {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener("input", () => {
        preview.textContent = input.value.trim() || placeholder;
    });
});

// Format the submission date.
const dateInput = document.getElementById("submissionDate");
const datePreview = document.getElementById("previewDate");

dateInput.addEventListener("input", () => {
    if (!dateInput.value) {
        datePreview.textContent = "Date";
        return;
    }

    const [year, month, day] = dateInput.value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    datePreview.textContent = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
});

// Download the cover as an A4 PDF.
document.getElementById("downloadBtn").addEventListener("click", async () => {
    const button = document.getElementById("downloadBtn");
    const cover = document.getElementById("cover");

    if (typeof html2pdf === "undefined") {
        alert("PDF tool not loaded. Check your internet connection and reload the page.");
        return;
    }

    button.disabled = true;
    button.textContent = "Preparing PDF...";

    try {
        // Wait for the university logo to load.
        const logo = cover.querySelector(".university-logo");

        if (logo && !logo.complete) {
            await new Promise((resolve, reject) => {
                logo.onload = resolve;
                logo.onerror = reject;
            });
        }

        const options = {
            margin: 0,
            filename: "BRACU_Assignment_Cover.pdf",
            image: {
                type: "jpeg",
                quality: 0.98
            },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            },
            pagebreak: {
                mode: ["avoid-all", "css", "legacy"]
            }
        };

        await html2pdf().set(options).from(cover).save();
    } catch (error) {
        console.error(error);
        alert("PDF export failed. Check that your logo is available and try again.");
    } finally {
        button.disabled = false;
        button.textContent = "Download Cover as PDF";
    }
});
