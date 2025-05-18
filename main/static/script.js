
// DOM elements
const jobDescriptionInput = document.getElementById('jobDescriptionInput');
const translateButton = document.getElementById('translateButton');
const clearButton = document.getElementById('clearButton');
const copyButton = document.getElementById('copyButton');
const outputPlaceholder = document.getElementById('outputPlaceholder');
const outputContent = document.getElementById('outputContent');
const loadingIndicator = document.getElementById('loadingIndicator');

// Event listeners
jobDescriptionInput.addEventListener('input', handleInputChange);
translateButton.addEventListener('click', translateJobDescription);
clearButton.addEventListener('click', clearJobDescription);
copyButton.addEventListener('click', copyToClipboard);

// Enable/disable translate button based on input
function handleInputChange() {
  const hasText = jobDescriptionInput.value.trim().length > 0;
  translateButton.disabled = !hasText;
}

// Clear the input field
function clearJobDescription() {
  jobDescriptionInput.value = '';
  translateButton.disabled = true;
}

// Copy the translated output to clipboard
function copyToClipboard() {
  if (outputContent.textContent) {
    navigator.clipboard.writeText(outputContent.textContent)
      .then(() => {
        // Show copied feedback
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
}

// Simulate AI translation of job description
function translateJobDescription() {
  const jobDescription = jobDescriptionInput.value.trim();
  
  if (!jobDescription) return;
  
  // Show loading state
  outputPlaceholder.classList.add('hidden');
  outputContent.classList.add('hidden');
  outputContent.textContent = ''; // Clear previous content
  loadingIndicator.classList.remove('hidden');
  loadingIndicator.classList.add('flex'); // Ensure flex is used if it's a flex container
  translateButton.disabled = true;
  copyButton.disabled = true; // Disable copy button during loading
  
  // Actual API call to the backend
  const formData = new FormData();
  formData.append('job_description', jobDescription);

  fetch('/tools/job-simplify/translate', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    loadingIndicator.classList.add('hidden');
    loadingIndicator.classList.remove('flex');
    if (data.error) {
      // Display error message in placeholder
      outputPlaceholder.innerHTML = `<p class="text-red-500">${data.error}</p>`;
      outputPlaceholder.classList.remove('hidden');
      outputContent.classList.add('hidden');
      outputContent.textContent = '';
      showToast("Error", data.error, true);
    } else {
      // Update UI with response
      outputContent.textContent = data.translated;
      outputContent.classList.remove('hidden');
      outputPlaceholder.classList.add('hidden'); // Ensure placeholder is hidden on success
      copyButton.disabled = false;
      showToast("Translation complete!", "Your job description has been simplified.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    loadingIndicator.classList.add('hidden');
    loadingIndicator.classList.remove('flex');
    outputPlaceholder.innerHTML = `<p class="text-red-500">An unexpected error occurred. Please try again.</p>`;
    outputPlaceholder.classList.remove('hidden');
    outputContent.classList.add('hidden');
    outputContent.textContent = '';
    showToast("Error", "An unexpected error occurred. Please try again.", true);
  })
  .finally(() => {
    translateButton.disabled = false;
  });
}

// Toast notification system
function showToast(title, message, isError = false) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-lg border ${isError ? 'border-red-400' : 'border-gray-200'} pointer-events-auto`;
  
  toast.innerHTML = `
    <div class="p-4">
      <div class="flex items-start">
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-900">${title}</p>
          <p class="mt-1 text-sm text-gray-500">${message}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
  
  // Add close button functionality
  const closeButton = toast.querySelector('button');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(toast);
  });
}

// Initialize the app
function init() {
  handleInputChange();
}

// Start the application
init();
