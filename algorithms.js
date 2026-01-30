// ==================== GLOBAL VARIABLES ====================
let currentArray = [];
let isAnimating = false;
let isPaused = false;
let animationSpeed = 800;
let steps = [];
let currentStep = 0;
let currentAlgorithm = 'bubble';
let currentRunId = 0;

// ==================== STATS TRACKING ====================
let algorithmStats = {
    comparisons: 0,
    swaps: 0,
    passes: 0,
    rotations: 0 // For Binary Search or Trees
};

function resetStats() {
    algorithmStats = { comparisons: 0, swaps: 0, passes: 0, rotations: 0 };
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const statsContainer = document.getElementById('algorithmStats');
    if (!statsContainer) return;

    let html = '';
    if (algorithmStats.passes > 0) html += `<span><strong>Passes:</strong> ${algorithmStats.passes}</span>`;
    if (algorithmStats.comparisons > 0) html += `<span><strong>Comparisons:</strong> ${algorithmStats.comparisons}</span>`;
    if (algorithmStats.swaps > 0) html += `<span><strong>Swaps:</strong> ${algorithmStats.swaps}</span>`;
    if (algorithmStats.rotations > 0) html += `<span><strong>Rotations/Steps:</strong> ${algorithmStats.rotations}</span>`;

    statsContainer.innerHTML = html || '<span><em>Algorithm not started</em></span>';
}

// ==================== UTILITY FUNCTIONS ====================
function generateArray(size = 8) {
    currentArray = [];
    for (let i = 0; i < size; i++) {
        currentArray.push(Math.floor(Math.random() * 100) + 1);
    }
    return currentArray;
}

function displayArray(arr, activeIndexes = [], comparingIndexes = [], sortedIndexes = [], swappingIndexes = [], labels = {}) {
    const display = document.getElementById('arrayDisplay');
    if (!display) return;

    display.innerHTML = '';

    arr.forEach((value, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'element-wrapper';

        if (labels[index]) {
            const label = document.createElement('div');
            label.className = 'element-label';
            label.textContent = labels[index];
            wrapper.appendChild(label);
        }

        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = value;
        element.setAttribute('data-index', index);

        if (activeIndexes.includes(index)) {
            element.classList.add('active');
        }
        if (comparingIndexes.includes(index)) {
            element.classList.add('comparing');
        }
        if (sortedIndexes.includes(index)) {
            element.classList.add('sorted');
        }
        if (swappingIndexes.includes(index)) {
            element.classList.add('swapping');
        }

        wrapper.appendChild(element);
        display.appendChild(wrapper);
    });
}

function addStep(description) {
    steps.push(description);
    updateStepsDisplay();
}

function updateStepsDisplay() {
    const stepsContainer = document.getElementById('stepsOutput');
    if (!stepsContainer) return;

    stepsContainer.innerHTML = '';
    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = `step ${index === currentStep ? 'current' : ''}`;
        stepElement.textContent = `Step ${index + 1}: ${step}`;
        stepsContainer.appendChild(stepElement);
    });

    // Scroll to bottom
    stepsContainer.scrollTop = stepsContainer.scrollHeight;
}

// ==================== RESIZE LISTENER ====================
window.addEventListener('resize', () => {
    if (currentAlgorithm === 'circularqueue') {
        updateCircularQueueVisualization();
    } else if (currentAlgorithm === 'bst') {
        updateBSTVisualization();
    } else if (currentAlgorithm === 'avl') {
        updateAVLVisualization();
    }
});

// ==================== FAB RESET FUNCTION ====================
function resetVisualization() {
    if (currentAlgorithm === 'bubble' || currentAlgorithm === 'selection' || currentAlgorithm === 'insertion') {
        generateArray();
    } else if (currentAlgorithm === 'search') {
        generateSearchArray();
    } else if (currentAlgorithm === 'stack') {
        resetStack();
    } else if (currentAlgorithm === 'queue') {
        if (typeof resetCircularQueue === 'function') resetCircularQueue();
        else resetQueue();
    } else if (currentAlgorithm === 'linkedlist') {
        resetLinkedList();
    } else if (currentAlgorithm === 'bst') {
        resetBST();
    } else if (currentAlgorithm === 'avl') {
        resetAVL();
    }
}

function clearSteps() {
    steps = [];
    currentStep = 0;
    updateStepsDisplay();
}

function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) return;

    statusDiv.className = `status-message status-${type}`;
    statusDiv.textContent = message;
}

// ==================== SORTING ALGORITHMS ====================

// Bubble Sort with step-by-step
async function startBubbleSort() {
    if (isAnimating) return;
    currentRunId++;
    const runId = currentRunId;
    isAnimating = true;
    isPaused = false;
    resetStats();

    const arr = [...currentArray];
    const n = arr.length;
    clearSteps();
    addStep(`Starting Bubble Sort on array: [${arr}]`);

    for (let i = 0; i < n - 1; i++) {
        algorithmStats.passes++;
        updateStatsDisplay();
        addStep(`Pass ${i + 1}: Looking for largest element in remaining array`);

        for (let j = 0; j < n - i - 1; j++) {
            algorithmStats.comparisons++;
            updateStatsDisplay();
            // Show comparison
            displayArray(arr, [], [j, j + 1], Array.from({ length: i }, (_, k) => n - k - 1), [], { [j]: 'j', [j + 1]: 'j+1' });
            addStep(`Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`);
            if (await sleep(animationSpeed, runId)) return;

            if (arr[j] > arr[j + 1]) {
                algorithmStats.swaps++;
                updateStatsDisplay();
                // Show swapping
                displayArray(arr, [], [], Array.from({ length: i }, (_, k) => n - k - 1), [j, j + 1], { [j]: 'swap', [j + 1]: 'swap' });
                addStep(`Swapping ${arr[j]} and ${arr[j + 1]} because ${arr[j]} > ${arr[j + 1]}`);
                if (await sleep(animationSpeed, runId)) return;

                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                // Show after swap
                displayArray(arr, [], [], Array.from({ length: i }, (_, k) => n - k - 1), [j, j + 1], { [j]: 'j', [j + 1]: 'j+1' });
                addStep(`After swap: arr[${j}] = ${arr[j]}, arr[${j + 1}] = ${arr[j + 1]}`);
                if (await sleep(animationSpeed, runId)) return;
            } else {
                addStep(`No swap needed (${arr[j]} ≤ ${arr[j + 1]})`);
            }
        }

        // Mark sorted element
        displayArray(arr, [], [], Array.from({ length: i + 1 }, (_, k) => n - k - 1));
        addStep(`Element ${arr[n - i - 1]} is now in its correct position at index ${n - i - 1}`);
        if (await sleep(animationSpeed, runId)) return;
    }

    displayArray(arr, [], [], Array.from({ length: n }, (_, k) => k));
    addStep(`Bubble Sort completed! Array is sorted: [${arr}]`);
    showStatus('Bubble Sort completed successfully!', 'success');
    isAnimating = false;
}

// Selection Sort with step-by-step
async function startSelectionSort() {
    if (isAnimating) return;
    currentRunId++;
    const runId = currentRunId;
    isAnimating = true;
    isPaused = false;
    resetStats();

    const arr = [...currentArray];
    const n = arr.length;
    clearSteps();
    addStep(`Starting Selection Sort on array: [${arr}]`);

    for (let i = 0; i < n - 1; i++) {
        algorithmStats.passes++;
        updateStatsDisplay();
        addStep(`Pass ${i + 1}: Finding minimum element from index ${i} to ${n - 1}`);
        let minIdx = i;

        // Find minimum
        for (let j = i + 1; j < n; j++) {
            algorithmStats.comparisons++;
            updateStatsDisplay();
            displayArray(arr, [minIdx], [j], Array.from({ length: i }, (_, k) => k), [], { [minIdx]: 'minIdx', [j]: 'j' });
            addStep(`Comparing current min ${arr[minIdx]} with ${arr[j]}`);
            if (await sleep(animationSpeed, runId)) return;

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                displayArray(arr, [minIdx], [], Array.from({ length: i }, (_, k) => k), [], { [minIdx]: 'minIdx' });
                addStep(`New minimum found: ${arr[minIdx]} at index ${minIdx}`);
                if (await sleep(animationSpeed, runId)) return;
            }
        }

        // Swap if needed
        if (minIdx !== i) {
            algorithmStats.swaps++;
            updateStatsDisplay();
            displayArray(arr, [i, minIdx], [], Array.from({ length: i }, (_, k) => k), [i, minIdx], { [i]: 'i', [minIdx]: 'minIdx' });
            addStep(`Swapping ${arr[i]} (index ${i}) with minimum ${arr[minIdx]} (index ${minIdx})`);
            if (await sleep(animationSpeed, runId)) return;

            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

            displayArray(arr, [i, minIdx], [], Array.from({ length: i }, (_, k) => k), [i, minIdx], { [i]: 'i', [minIdx]: 'minIdx' });
            addStep(`After swap: arr[${i}] = ${arr[i]}, arr[${minIdx}] = ${arr[minIdx]}`);
            if (await sleep(animationSpeed, runId)) return;
        } else {
            addStep(`Minimum is already at correct position (index ${i})`);
        }

        // Mark sorted
        displayArray(arr, [], [], Array.from({ length: i + 1 }, (_, k) => k));
        addStep(`Element ${arr[i]} is now in correct position at index ${i}`);
        if (await sleep(animationSpeed, runId)) return;
    }

    displayArray(arr, [], [], Array.from({ length: n }, (_, k) => k));
    addStep(`Selection Sort completed! Array is sorted: [${arr}]`);
    showStatus('Selection Sort completed successfully!', 'success');
    isAnimating = false;
}

// Insertion Sort with step-by-step
async function startInsertionSort() {
    if (isAnimating) return;
    currentRunId++;
    const runId = currentRunId;
    isAnimating = true;
    isPaused = false;
    resetStats();

    const arr = [...currentArray];
    const n = arr.length;
    clearSteps();
    addStep(`Starting Insertion Sort on array: [${arr}]`);

    for (let i = 1; i < n; i++) {
        algorithmStats.passes++;
        updateStatsDisplay();
        addStep(`Pass ${i}: Inserting element ${arr[i]} into sorted subarray [0..${i - 1}]`);
        let key = arr[i];
        let j = i - 1;

        displayArray(arr, [i], [], Array.from({ length: i }, (_, k) => k), [], { [i]: 'key' });
        if (await sleep(animationSpeed, runId)) return;

        while (j >= 0 && arr[j] > key) {
            algorithmStats.comparisons++;
            algorithmStats.swaps++; // Treating shifts as swaps for stats consistency
            updateStatsDisplay();
            displayArray(arr, [j, j + 1], [], Array.from({ length: i }, (_, k) => k), [], { [j]: 'j', [j + 1]: 'j+1' });
            addStep(`Shifting ${arr[j]} to position ${j + 1} because ${arr[j]} > ${key}`);
            if (await sleep(animationSpeed, runId)) return;

            arr[j + 1] = arr[j];
            j--;
        }

        // Final comparison that fails the while condition
        if (j >= 0) {
            algorithmStats.comparisons++;
            updateStatsDisplay();
        }

        arr[j + 1] = key;
        displayArray(arr, [j + 1], [], Array.from({ length: i + 1 }, (_, k) => k), [], { [j + 1]: 'inserted' });
        addStep(`Inserted ${key} at position ${j + 1}`);
        if (await sleep(animationSpeed, runId)) return;
    }

    displayArray(arr, [], [], Array.from({ length: n }, (_, k) => k));
    addStep(`Insertion Sort completed! Array is sorted: [${arr}]`);
    showStatus('Insertion Sort completed successfully!', 'success');
    isAnimating = false;
}

// ==================== SEARCHING ALGORITHMS ====================

// Linear Search
async function startLinearSearch() {
    if (isAnimating) return;

    const target = document.getElementById('searchValue').value;
    if (!target) {
        showStatus('Please enter a value to search', 'error');
        return;
    }

    currentRunId++;
    const runId = currentRunId;
    isAnimating = true;
    isPaused = false;
    resetStats();
    const arr = [...currentArray];
    const targetNum = parseInt(target);
    clearSteps();
    addStep(`Starting Linear Search for value ${targetNum}`);
    addStep(`Array: [${arr}]`);

    for (let i = 0; i < arr.length; i++) {
        algorithmStats.passes++; // Using passes as "Steps"
        algorithmStats.comparisons++;
        updateStatsDisplay();
        displayArray(arr, [i], [], [], [], { [i]: 'i' });
        addStep(`Checking element at index ${i}: ${arr[i]}`);
        if (await sleep(animationSpeed, runId)) return;

        if (arr[i] === targetNum) {
            displayArray(arr, [], [i], [], [], { [i]: 'Found!' });
            addStep(`✅ Found ${targetNum} at index ${i}!`);
            showStatus(`Found ${targetNum} at index ${i}`, 'success');
            isAnimating = false;
            return;
        } else {
            addStep(`❌ ${arr[i]} ≠ ${targetNum}, moving to next element`);
        }
    }

    addStep(`❌ Value ${targetNum} not found in array`);
    showStatus(`${targetNum} not found in array`, 'error');
    isAnimating = false;
}

// Binary Search (requires sorted array)
async function startBinarySearch() {
    if (isAnimating) return;

    const target = document.getElementById('searchValue').value;
    if (!target) {
        showStatus('Please enter a value to search', 'error');
        return;
    }

    currentRunId++;
    const runId = currentRunId;
    isAnimating = true;
    isPaused = false;
    resetStats();
    const arr = [...currentArray].sort((a, b) => a - b);
    const targetNum = parseInt(target);
    clearSteps();
    addStep(`Starting Binary Search for value ${targetNum}`);
    addStep(`Sorted Array: [${arr}] (Binary search requires sorted array)`);

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        algorithmStats.passes++; // Steps
        algorithmStats.comparisons++;
        updateStatsDisplay();
        const mid = Math.floor((left + right) / 2);

        displayArray(arr, [mid], [left, right], [], [], { [left]: 'L', [right]: 'R', [mid]: 'Mid' });
        addStep(`Search range: [${left}..${right}], Mid index: ${mid}, Mid value: ${arr[mid]}`);
        if (await sleep(animationSpeed, runId)) return;

        if (arr[mid] === targetNum) {
            displayArray(arr, [], [mid], [], [], { [mid]: 'Found!' });
            addStep(`✅ Found ${targetNum} at index ${mid}!`);
            showStatus(`Found ${targetNum} at index ${mid}`, 'success');
            isAnimating = false;
            return;
        } else if (arr[mid] < targetNum) {
            addStep(`${arr[mid]} < ${targetNum}, searching right half [${mid + 1}..${right}]`);
            left = mid + 1;
        } else {
            addStep(`${arr[mid]} > ${targetNum}, searching left half [${left}..${mid - 1}]`);
            right = mid - 1;
        }

        if (await sleep(animationSpeed, runId)) return;
    }

    addStep(`❌ Value ${targetNum} not found in array`);
    showStatus(`${targetNum} not found in array`, 'error');
    isAnimating = false;
}

// ==================== DATA STRUCTURES ====================

// Stack Implementation
class Stack {
    constructor() {
        this.items = [];
        this.maxSize = 10;
    }

    push(value) {
        if (this.items.length >= this.maxSize) {
            return false;
        }
        this.items.push(value);
        return true;
    }

    pop() {
        if (this.items.length === 0) {
            return null;
        }
        return this.items.pop();
    }

    peek() {
        if (this.items.length === 0) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
    }
}

let stack = new Stack();

function displayStack() {
    const container = document.getElementById('structureDisplay');
    if (!container) return;

    container.innerHTML = '';

    if (stack.isEmpty()) {
        container.innerHTML = '<div class="status-message status-info">Stack is empty</div>';
        return;
    }

    // Display stack from top to bottom
    for (let i = stack.items.length - 1; i >= 0; i--) {
        const wrapper = document.createElement('div');
        wrapper.className = 'element-wrapper';

        if (i === stack.items.length - 1) {
            const label = document.createElement('div');
            label.className = 'element-label';
            label.textContent = 'TOP';
            wrapper.appendChild(label);
        }

        const element = document.createElement('div');
        element.className = 'array-element'; // Use same class for consistency
        element.textContent = stack.items[i];

        if (i === stack.items.length - 1) {
            element.classList.add('active');
        }

        wrapper.appendChild(element);
        container.appendChild(wrapper);

        // Add arrow between elements
        if (i > 0) {
            const arrow = document.createElement('div');
            arrow.textContent = '↓';
            arrow.style.fontSize = '24px';
            arrow.style.color = '#6c4ce0';
            arrow.style.margin = '5px 0';
            arrow.style.fontWeight = 'bold';
            container.appendChild(arrow);
        }
    }
}

function pushToStack() {
    algorithmStats.passes++;
    updateStatsDisplay();
    const valueInput = document.getElementById('dsValue');
    if (!valueInput || !valueInput.value.trim()) {
        showStatus('Please enter a value', 'error');
        return;
    }

    const value = valueInput.value.trim();
    if (stack.push(value)) {
        addStep(`Pushed ${value} to stack`);
        displayStack();
        showStatus(`Pushed ${value} to stack. Stack size: ${stack.size()}`, 'success');
        valueInput.value = '';
    } else {
        showStatus('Stack is full! Max size: 10', 'error');
    }
}

function popFromStack() {
    algorithmStats.passes++;
    updateStatsDisplay();
    if (stack.isEmpty()) {
        showStatus('Stack is empty!', 'error');
        return;
    }

    const value = stack.pop();
    addStep(`Popped ${value} from stack`);
    displayStack();
    showStatus(`Popped ${value} from stack. Stack size: ${stack.size()}`, 'success');
}

function peekStack() {
    const value = stack.peek();
    if (value === null) {
        showStatus('Stack is empty!', 'error');
    } else {
        showStatus(`Top element is: ${value}`, 'info');
        addStep(`Peeked at stack top: ${value}`);
    }
}

// Queue Implementation
class Queue {
    constructor() {
        this.items = [];
        this.maxSize = 10;
    }

    enqueue(value) {
        if (this.items.length >= this.maxSize) {
            return false;
        }
        this.items.push(value);
        return true;
    }

    dequeue() {
        if (this.items.length === 0) {
            return null;
        }
        return this.items.shift();
    }

    front() {
        if (this.items.length === 0) {
            return null;
        }
        return this.items[0];
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
    }
}

let queue = new Queue();

function displayLinearQueue() {
    const container = document.getElementById('structureDisplay');
    if (!container) return;

    container.innerHTML = '';

    if (queue.isEmpty()) {
        container.innerHTML = '<div class="status-message status-info">Queue is empty</div>';
        return;
    }

    const queueVis = document.createElement('div');
    queueVis.className = 'array-display';
    queueVis.style.background = 'transparent';
    queueVis.style.border = 'none';

    queue.items.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'element-wrapper';

        let labelText = '';
        if (index === 0) labelText = 'FRONT';
        if (index === queue.items.length - 1) labelText = labelText ? 'FRONT & REAR' : 'REAR';

        if (labelText) {
            const label = document.createElement('div');
            label.className = 'element-label';
            label.textContent = labelText;
            wrapper.appendChild(label);
        }

        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = item;

        if (index === 0) element.classList.add('active');

        wrapper.appendChild(element);
        queueVis.appendChild(wrapper);

        if (index < queue.items.length - 1) {
            const arrow = document.createElement('div');
            arrow.textContent = '→';
            arrow.style.fontSize = '24px';
            arrow.style.color = '#6c4ce0';
            arrow.style.fontWeight = 'bold';
            arrow.style.alignSelf = 'center';
            queueVis.appendChild(arrow);
        }
    });

    container.appendChild(queueVis);
}

function enqueueToQueue() {
    algorithmStats.passes++;
    updateStatsDisplay();
    const valueInput = document.getElementById('dsValue');
    if (!valueInput || !valueInput.value.trim()) {
        showStatus('Please enter a value', 'error');
        return;
    }

    const value = valueInput.value.trim();
    if (queue.enqueue(value)) {
        addStep(`Enqueued ${value} to queue`);
        displayLinearQueue();
        showStatus(`Enqueued ${value} to queue. Queue size: ${queue.size()}`, 'success');
        valueInput.value = '';
    } else {
        showStatus('Queue is full! Max size: 10', 'error');
    }
}

function dequeueFromQueue() {
    algorithmStats.passes++;
    updateStatsDisplay();
    if (queue.isEmpty()) {
        showStatus('Queue is empty!', 'error');
        return;
    }

    const value = queue.dequeue();
    addStep(`Dequeued ${value} from queue`);
    displayLinearQueue();
    showStatus(`Dequeued ${value} from queue. Queue size: ${queue.size()}`, 'success');
}

function frontQueue() {
    const value = queue.front();
    if (value === null) {
        showStatus('Queue is empty!', 'error');
    } else {
        showStatus(`Front element is: ${value}`, 'info');
        addStep(`Checked queue front: ${value}`);
    }
}

// Linked List Implementation
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    Node = class {
        constructor(value) {
            this.value = value;
            this.next = null;
        }
    }

    add(value) {
        const newNode = new this.Node(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
        return true;
    }

    remove(value) {
        if (!this.head) return false;

        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            return true;
        }

        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }

        return false;
    }

    search(value) {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.value === value) return index;
            current = current.next;
            index++;
        }
        return -1;
    }

    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }

    clear() {
        this.head = null;
        this.size = 0;
    }

    addAtFirst(value) {
        const newNode = new this.Node(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        this.size++;
        return true;
    }

    removeFirst() {
        if (!this.head) return null;
        const value = this.head.value;
        this.head = this.head.next;
        this.size--;
        return value;
    }

    removeLast() {
        if (!this.head) return null;
        if (!this.head.next) {
            const value = this.head.value;
            this.head = null;
            this.size--;
            return value;
        }
        let current = this.head;
        while (current.next && current.next.next) {
            current = current.next;
        }
        const value = current.next.value;
        current.next = null;
        this.size--;
        return value;
    }
}

let linkedList = new LinkedList();

function displayLinkedList(highlightValue = null) {
    const container = document.getElementById('structureDisplay');
    if (!container) return;

    container.innerHTML = '';

    if (linkedList.size === 0) {
        container.innerHTML = '<div class="status-message status-info">Linked List is empty</div>';
        return;
    }

    const listVis = document.createElement('div');
    listVis.className = 'array-display';
    listVis.style.background = 'transparent';
    listVis.style.border = 'none';

    let current = linkedList.head;
    let index = 0;

    while (current) {
        const wrapper = document.createElement('div');
        wrapper.className = 'element-wrapper';

        let labelText = '';
        if (index === 0) labelText = 'HEAD';
        if (!current.next) labelText = labelText ? 'HEAD & TAIL' : 'TAIL';

        if (labelText) {
            const label = document.createElement('div');
            label.className = 'element-label tail-label'; // Added tail-label class just in case specific styling is needed
            label.textContent = labelText;
            wrapper.appendChild(label);
        }

        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = current.value;

        if (current.value === highlightValue) {
            element.classList.add('active');
        }

        wrapper.appendChild(element);
        listVis.appendChild(wrapper);

        if (current.next) {
            const arrow = document.createElement('div');
            arrow.textContent = '→';
            arrow.style.fontSize = '24px';
            arrow.style.color = '#6c4ce0';
            arrow.style.fontWeight = 'bold';
            arrow.style.alignSelf = 'center';
            listVis.appendChild(arrow);
        }

        current = current.next;
        index++;
    }

    container.appendChild(listVis);
}

function addToLinkedList() {
    algorithmStats.passes++;
    updateStatsDisplay();
    const valueInput = document.getElementById('dsValue');
    if (!valueInput || !valueInput.value.trim()) {
        showStatus('Please enter a value', 'error');
        return;
    }

    const value = valueInput.value.trim();
    if (linkedList.add(value)) {
        addStep(`Added ${value} to linked list`);
        displayLinkedList();
        showStatus(`Added ${value} to linked list. Size: ${linkedList.size}`, 'success');
        valueInput.value = '';
    }
}

function removeFromLinkedList() {
    algorithmStats.passes++;
    updateStatsDisplay();
    const valueInput = document.getElementById('dsValue');
    if (!valueInput || !valueInput.value.trim()) {
        showStatus('Please enter a value to remove', 'error');
        return;
    }

    const value = valueInput.value.trim();
    if (linkedList.remove(value)) {
        addStep(`Removed ${value} from linked list`);
        displayLinkedList();
        showStatus(`Removed ${value} from linked list. Size: ${linkedList.size}`, 'success');
        valueInput.value = '';
    } else {
        showStatus(`${value} not found in linked list`, 'error');
    }
}

function searchInLinkedList() {
    algorithmStats.passes++;
    updateStatsDisplay();
    const valueInput = document.getElementById('dsValue');
    if (!valueInput || !valueInput.value.trim()) {
        showStatus('Please enter a value to search', 'error');
        return;
    }

    const value = valueInput.value.trim();
    const index = linkedList.search(value);

    if (index !== -1) {
        addStep(`Found ${value} at index ${index}`);
        displayLinkedList(value);
        showStatus(`Found ${value} at index ${index}`, 'success');
    } else {
        addStep(`${value} not found in linked list`);
        showStatus(`${value} not found in linked list`, 'error');
    }
}

function addAtFirstToLinkedList() {
    algorithmStats.passes++;
    updateStatsDisplay();
    const valueInput = document.getElementById('dsValue');
    if (!valueInput || !valueInput.value.trim()) {
        showStatus('Please enter a value', 'error');
        return;
    }

    const value = valueInput.value.trim();
    if (linkedList.addAtFirst(value)) {
        addStep(`Added ${value} at first position`);
        displayLinkedList();
        showStatus(`Added ${value} at first position. Size: ${linkedList.size}`, 'success');
        valueInput.value = '';
    }
}

function removeFirstFromLinkedList() {
    algorithmStats.passes++;
    updateStatsDisplay();

    if (linkedList.size === 0) {
        showStatus('Linked List is empty', 'error');
        return;
    }

    const value = linkedList.removeFirst();
    if (value !== null) {
        addStep(`Removed ${value} from first position`);
        displayLinkedList();
        showStatus(`Removed ${value} from first position. Size: ${linkedList.size}`, 'success');
    }
}

function removeLastFromLinkedList() {
    algorithmStats.passes++;
    updateStatsDisplay();

    if (linkedList.size === 0) {
        showStatus('Linked List is empty', 'error');
        return;
    }

    const value = linkedList.removeLast();
    if (value !== null) {
        addStep(`Removed ${value} from last position`);
        displayLinkedList();
        showStatus(`Removed ${value} from last position. Size: ${linkedList.size}`, 'success');
    }
}

// ==================== UI FUNCTIONS ====================

function sleep(ms, runId) {
    return new Promise(resolve => {
        const check = async () => {
            if (runId !== undefined && runId !== currentRunId) {
                resolve(true); // Signal to stop the current run
                return;
            }
            if (isPaused) {
                setTimeout(check, 100);
            } else {
                setTimeout(() => resolve(false), ms);
            }
        };
        check();
    });
}

function stopVisualization() {
    isPaused = true;
    showStatus("Visualization Paused", "info");
    const stopBtn = document.getElementById('stopBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    if (stopBtn) stopBtn.disabled = true;
    if (resumeBtn) resumeBtn.disabled = false;
}

function resumeVisualization() {
    isPaused = false;
    showStatus("Visualization Resumed", "success");
    const stopBtn = document.getElementById('stopBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    if (stopBtn) stopBtn.disabled = false;
    if (resumeBtn) resumeBtn.disabled = true;
}

function generateNewArray() {
    const sizeInput = document.getElementById('arraySize');
    const size = sizeInput ? parseInt(sizeInput.value) : 8;
    if (isNaN(size) || size < 3 || size > 20) {
        showStatus('Please enter array size between 3 and 20', 'error');
        return;
    }

    currentArray = generateArray(size);
    displayArray(currentArray);
    clearSteps();
    showStatus(`Generated new array with ${size} random elements`, 'success');
}

function updateSpeed() {
    const speedInput = document.getElementById('speedControl');
    if (speedInput) {
        // Convert to milliseconds (1000 = slow, 100 = fast)
        animationSpeed = 1100 - speedInput.value;
    }
}

function resetVisualization() {
    isAnimating = false;
    clearSteps();
    resetStats();
    generateNewArray();
    showStatus('Visualization reset', 'info');
}

// ==================== SHOW ALGORITHM CONTENT ====================

function showAlgorithm(algoType) {
    currentAlgorithm = algoType;
    const container = document.getElementById('algorithmContent');
    if (!container) return;

    // Show back button
    if (typeof addBackButton === 'function') {
        addBackButton();
    }

    // Generate new array if needed
    if (currentArray.length === 0 || !currentArray) {
        currentArray = generateArray(8);
    }

    let content = '';

    switch (algoType) {
        case 'bubble':
            content = createSortingContent('Bubble Sort', 'bubble');
            break;
        case 'selection':
            content = createSortingContent('Selection Sort', 'selection');
            break;
        case 'insertion':
            content = createSortingContent('Insertion Sort', 'insertion');
            break;
        case 'search':
            content = createSearchContent();
            break;
        case 'stack':
            content = createStackContent();
            break;
        case 'queue':
            content = createQueueContent();
            break;
        case 'linkedlist':
            content = createLinkedListContent();
            break;
        case 'bst':
            showBST();
            return;
        case 'avl':
            showAVL();
            return;
        default:
            content = `
                <h3>Select an Algorithm</h3>
                <p>Choose an algorithm from the buttons above to visualize its working.</p>
                <div class="info-panel">
                    <h4>How to use:</h4>
                    <p>1. Click any algorithm button</p>
                    <p>2. Generate or enter array elements</p>
                    <p>3. Use controls to visualize step-by-step</p>
                    <p>4. Watch the steps in the output panel</p>
                </div>
            `;
    }

    container.innerHTML = content;

    // Initialize display
    if (algoType === 'bubble' || algoType === 'selection' || algoType === 'insertion' || algoType === 'search') {
        displayArray(currentArray);
    } else if (algoType === 'stack') {
        displayStack();
    } else if (algoType === 'queue') {
        displayLinearQueue();
    } else if (algoType === 'linkedlist') {
        displayLinkedList();
    }

    // Add step-by-step output area
    const stepsDiv = document.createElement('div');
    stepsDiv.className = 'steps-container';
    stepsDiv.innerHTML = '<h4>Step-by-Step Execution:</h4><div id="stepsOutput"></div>';
    container.appendChild(stepsDiv);

    // Add status message area
    const statusDiv = document.createElement('div');
    statusDiv.id = 'statusMessage';
    statusDiv.className = 'status-message status-info';
    container.appendChild(statusDiv);

    // Initialize steps
    clearSteps();
}

function createSortingContent(title, type) {
    return `
        <h3>${title} Visualization</h3>
        
        <div class="info-panel">
            <h4>Algorithm Information:</h4>
            <p><strong>Time Complexity:</strong> O(n²) worst and average case</p>
            <p><strong>Space Complexity:</strong> O(1)</p>
            <p><strong>Stability:</strong> ${type === 'bubble' || type === 'insertion' ? 'Stable' : 'Not stable'}</p>
            <p><strong>Best for:</strong> ${type === 'bubble' ? 'Educational purposes, small datasets' :
            type === 'selection' ? 'Minimizing swaps, small datasets' :
                'Nearly sorted arrays, small datasets'}</p>
        </div>

        <div class="formula-section">
            <h4>Key Logic / Formula:</h4>
            <code>${type === 'bubble' ? 'if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1])' :
            type === 'selection' ? 'if (arr[j] < arr[minIdx]) minIdx = j' :
                'while (j >= 0 && arr[j] > key) arr[j+1] = arr[j]'}</code>
        </div>

        <div id="algorithmStats" class="stats-panel">
            <span><strong>Passes:</strong> 0</span>
            <span><strong>Comparisons:</strong> 0</span>
            <span><strong>Swaps:</strong> 0</span>
        </div>
        
        <div class="array-container">
            <h4>Array Visualization:</h4>
            <div class="array-display" id="arrayDisplay"></div>
        </div>
        
        <div class="controls">
            <div class="input-group">
                <input type="number" id="arraySize" placeholder="Array Size (3-20)" value="8" min="3" max="20">
                <button class="control-btn" onclick="generateNewArray()">Generate New Array</button>
            </div>
            
            <div class="speed-control">
                <label for="speedControl">Animation Speed:</label>
                <input type="range" id="speedControl" min="100" max="1000" value="300" oninput="updateSpeed()">
                <span id="speedValue">Medium</span>
            </div>
            
            <button class="control-btn start" onclick="start${type.charAt(0).toUpperCase() + type.slice(1)}Sort()" id="startBtn">Start ${title}</button>
            <button class="control-btn stop" onclick="stopVisualization()" id="stopBtn">Stop</button>
            <button class="control-btn resume" onclick="resumeVisualization()" id="resumeBtn" disabled>Resume</button>
            <button class="control-btn reset" onclick="resetVisualization()">Reset</button>
        </div>
        
        <div class="code-snippet">
            <pre><code>${getAlgorithmCode(type)}</code></pre>
        </div>
    `;
}

function createSearchContent() {
    return `
        <h3>Search Algorithms</h3>
        
        <div class="info-panel">
            <h4>Available Algorithms:</h4>
            <p><strong>Linear Search:</strong> Checks each element sequentially. Time: O(n), Space: O(1)</p>
            <p><strong>Binary Search:</strong> Requires sorted array, divides search space in half. Time: O(log n), Space: O(1)</p>
        </div>

        <div class="formula-section">
            <h4>Key Logic / Formula:</h4>
            <code>Linear: if (arr[i] === target) | Binary: mid = (L + R) / 2</code>
        </div>

        <div id="algorithmStats" class="stats-panel">
            <span><strong>Steps/Passes:</strong> 0</span>
            <span><strong>Comparisons:</strong> 0</span>
        </div>
        
        <div class="array-container">
            <h4>Array Visualization:</h4>
            <div class="array-display" id="arrayDisplay"></div>
        </div>
        
        <div class="controls">
            <div class="input-group">
                <input type="number" id="arraySize" placeholder="Array Size (3-20)" value="8" min="3" max="20">
                <button class="control-btn" onclick="generateNewArray()">Generate New Array</button>
            </div>
            
            <div class="input-group">
                <input type="number" id="searchValue" placeholder="Enter value to search">
                <button class="control-btn start" onclick="startLinearSearch()">Linear Search</button>
                <button class="control-btn" onclick="startBinarySearch()">Binary Search</button>
            </div>
            
            <div class="speed-control">
                <label for="speedControl">Animation Speed:</label>
                <input type="range" id="speedControl" min="100" max="1000" value="300" oninput="updateSpeed()">
                <span id="speedValue">Medium</span>
            </div>
            
            <div class="controls-row">
                <button class="control-btn stop" onclick="stopVisualization()" id="stopBtn">Stop</button>
                <button class="control-btn resume" onclick="resumeVisualization()" id="resumeBtn" disabled>Resume</button>
                <button class="control-btn reset" onclick="resetVisualization()">Reset</button>
            </div>
        </div>
        
        <div class="code-snippet">
            <pre><code>${getSearchCode()}</code></pre>
        </div>
    `;
}

function createStackContent() {
    return `
        <h3>Stack Data Structure (LIFO - Last In First Out)</h3>
        
        <div class="info-panel">
            <h4>Stack Operations:</h4>
            <p><strong>Push:</strong> Add element to top of stack</p>
            <p><strong>Pop:</strong> Remove element from top of stack</p>
            <p><strong>Peek:</strong> View top element without removing</p>
            <p><strong>isEmpty:</strong> Check if stack is empty</p>
            <p><strong>Max Size:</strong> 10 elements</p>
        </div>

        <div class="formula-section">
            <h4>Key Logic / Formula:</h4>
            <code>Push: top++ | Pop: --top | LIFO</code>
        </div>

        <div id="algorithmStats" class="stats-panel">
            <span><strong>Operations:</strong> 0</span>
        </div>
        
        <div class="structure-container">
            <h4>Stack Visualization (Top to Bottom):</h4>
            <div id="structureDisplay"></div>
        </div>
        
        <div class="controls">
            <div class="input-group">
                <input type="text" id="dsValue" placeholder="Enter value">
                <button class="control-btn" onclick="pushToStack()">Push</button>
                <button class="control-btn" onclick="popFromStack()">Pop</button>
                <button class="control-btn" onclick="peekStack()">Peek</button>
            </div>
            
            <button class="control-btn reset" onclick="stack.clear(); displayStack(); clearSteps(); showStatus('Stack cleared', 'info')">Clear Stack</button>
        </div>
        
        <div class="code-snippet">
            <pre><code>${getStackCode()}</code></pre>
        </div>
    `;
}

function createQueueContent() {
    return `
        <h3>Queue Data Structure (FIFO - First In First Out)</h3>
        
        <div class="info-panel">
            <h4>Queue Operations:</h4>
            <p><strong>Enqueue:</strong> Add element to rear of queue</p>
            <p><strong>Dequeue:</strong> Remove element from front of queue</p>
            <p><strong>Front:</strong> View front element without removing</p>
            <p><strong>isEmpty:</strong> Check if queue is empty</p>
            <p><strong>Max Size:</strong> 10 elements</p>
        </div>

        <div class="formula-section">
            <h4>Key Logic / Formula:</h4>
            <code>Enqueue: rear++ | Dequeue: front++ | FIFO</code>
        </div>

        <div id="algorithmStats" class="stats-panel">
            <span><strong>Operations:</strong> 0</span>
        </div>
        
        <div class="structure-container">
            <h4>Queue Visualization (Front → Rear):</h4>
            <div id="structureDisplay"></div>
        </div>
        
        <div class="controls">
            <div class="input-group">
                <input type="text" id="dsValue" placeholder="Enter value">
                <button class="control-btn" onclick="enqueueToQueue()">Enqueue</button>
                <button class="control-btn" onclick="dequeueFromQueue()">Dequeue</button>
                <button class="control-btn" onclick="frontQueue()">Front</button>
            </div>
            
            <button class="control-btn reset" onclick="queue.clear(); displayLinearQueue(); clearSteps(); showStatus('Queue cleared', 'info')">Clear Queue</button>
        </div>
        
        <div class="code-snippet">
            <pre><code>${getQueueCode()}</code></pre>
        </div>
    `;
}

function createLinkedListContent() {
    return `
        <h3>Linked List Data Structure</h3>
        
        <div class="info-panel">
            <h4>Linked List Operations:</h4>
            <p><strong>Add:</strong> Insert element at end of list</p>
            <p><strong>Remove:</strong> Delete specific element from list</p>
            <p><strong>Search:</strong> Find element in list (returns index)</p>
            <p><strong>Size:</strong> Get number of elements in list</p>
        </div>

        <div class="formula-section">
            <h4>Key Logic / Formula:</h4>
            <code>newNode.next = curr.next; curr.next = newNode</code>
        </div>

        <div id="algorithmStats" class="stats-panel">
            <span><strong>Operations:</strong> 0</span>
        </div>
        
        <div class="structure-container">
            <h4>Linked List Visualization:</h4>
            <div id="structureDisplay"></div>
        </div>
        
        <div class="controls">
            <div class="input-group">
                <input type="text" id="dsValue" placeholder="Enter value">
                <button class="control-btn" onclick="addToLinkedList()">Add Last</button>
                <button class="control-btn" onclick="addAtFirstToLinkedList()">Add First</button>
                <button class="control-btn" onclick="removeFromLinkedList()">Remove Any</button>
                <button class="control-btn" onclick="removeFirstFromLinkedList()">Remove First</button>
                <button class="control-btn" onclick="removeLastFromLinkedList()">Remove Last</button>
                <button class="control-btn" onclick="searchInLinkedList()">Search</button>
            </div>
            
            <button class="control-btn reset" onclick="linkedList.clear(); displayLinkedList(); clearSteps(); showStatus('Linked List cleared', 'info')">Clear List</button>
        </div>
        
        <div class="code-snippet">
            <pre><code>${getLinkedListCode()}</code></pre>
        </div>
    `;
}

// ==================== ALGORITHM CODE SNIPPETS ====================

function getAlgorithmCode(type) {
    const codes = {
        bubble: `// Bubble Sort Algorithm
function bubbleSort(arr) {
    let n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        // Last i elements are already in place
        for (let j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if they are in wrong order
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}`,

        selection: `// Selection Sort Algorithm
function selectionSort(arr) {
    let n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        // Find minimum element in unsorted array
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        
        // Swap the found minimum with first element
        if (minIdx !== i) {
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
    return arr;
}`,

        insertion: `// Insertion Sort Algorithm
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
    };

    return codes[type] || '';
}

function getSearchCode() {
    return `// Linear Search
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;  // Found at index i
        }
    }
    return -1;  // Not found
}

// Binary Search (requires sorted array)
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;  // Found at index mid
        }
        
        if (arr[mid] < target) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1;  // Search left half
        }
    }
    return -1;  // Not found
}`;
}

function getStackCode() {
    return `// Stack Implementation
class Stack {
    constructor() {
        this.items = [];
        this.maxSize = 10;
    }

    // Push element to top of stack
    push(element) {
        if (this.items.length >= this.maxSize) {
            return false;  // Stack overflow
        }
        this.items.push(element);
        return true;
    }

    // Pop element from top of stack
    pop() {
        if (this.items.length === 0) {
            return null;  // Stack underflow
        }
        return this.items.pop();
    }

    // Peek at top element
    peek() {
        if (this.items.length === 0) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // Check if stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get stack size
    size() {
        return this.items.length;
    }

    // Clear stack
    clear() {
        this.items = [];
    }
}`;
}

function getQueueCode() {
    return `// Queue Implementation
class Queue {
    constructor() {
        this.items = [];
        this.maxSize = 10;
    }

    // Add element to rear of queue
    enqueue(element) {
        if (this.items.length >= this.maxSize) {
            return false;  // Queue overflow
        }
        this.items.push(element);
        return true;
    }

    // Remove element from front of queue
    dequeue() {
        if (this.items.length === 0) {
            return null;  // Queue underflow
        }
        return this.items.shift();
    }

    // View front element
    front() {
        if (this.items.length === 0) {
            return null;
        }
        return this.items[0];
    }

    // Check if queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get queue size
    size() {
        return this.items.length;
    }

    // Clear queue
    clear() {
        this.items = [];
    }
}`;
}

function getLinkedListCode() {
    return `// Node Class
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

// Linked List Class
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Add element to end of list
    add(value) {
        const newNode = new Node(value);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
        return true;
    }

    // Remove element from list
    remove(value) {
        if (!this.head) return false;

        // If head needs to be removed
        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            return true;
        }

        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }
        return false;
    }

    // Search for element
    search(value) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }

    // Get list size
    getSize() {
        return this.size;
    }

    // Check if list is empty
    isEmpty() {
        return this.size === 0;
    }

    // Clear list
    clear() {
        this.head = null;
        this.size = 0;
    }
}

// Add at first method
LinkedList.prototype.addAtFirst = function(value) {
    const newNode = new Node(value);
    
    if (!this.head) {
        this.head = newNode;
        this.size++;
        return true;
    }
    
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
    return true;
};

// Remove from first
LinkedList.prototype.removeFirst = function() {
    if (!this.head) return null;
    
    const value = this.head.value;
    this.head = this.head.next;
    this.size--;
    return value;
};

// Remove from last
LinkedList.prototype.removeLast = function() {
    if (!this.head) return null;
    
    if (!this.head.next) {
        const value = this.head.value;
        this.head = null;
        this.size--;
        return value;
    }
    
    let current = this.head;
    while (current.next && current.next.next) {
        current = current.next;
    }
    
    const value = current.next.value;
    current.next = null;
    this.size--;
    return value;
};`;
}

// ==================== TREE VISUALIZATION ====================

// BST Implementation
let bstRoot = null;
let bstSpeed = 500;

class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 0;
    }
}

function initBST() {
    bstRoot = null;
    updateBSTVisualization();
    logBST("BST initialized. Enter values to insert.");
}

async function insertBST() {
    const input = document.getElementById('bstInput').value;
    if (!input) {
        logBST("Please enter a value");
        return;
    }

    const values = input.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length === 0) return;

    if (isAnimating) return;
    currentRunId++;
    const runId = currentRunId;
    isAnimating = true;
    isPaused = false;
    resetStats();

    for (const value of values) {
        logBST(`Starting insertion of: ${value} `);
        bstRoot = await insertBSTNodeAnimated(bstRoot, value, runId);
        updateBSTVisualization();
        logBST(`Finished insertion of: ${value} `);
    }

    isAnimating = false;
    document.getElementById('bstInput').value = '';
}

async function insertBSTNodeAnimated(node, value, runId) {
    if (!node) {
        const newNode = new BSTNode(value);
        return newNode;
    }

    algorithmStats.comparisons++;
    algorithmStats.rotations++; // Steps
    updateStatsDisplay();

    // Highlight current node
    node.highlight = 'searching';
    updateBSTVisualization();
    if (await sleep(bstSpeed, runId)) return node;

    if (value < node.value) {
        node.highlight = 'searching';
        node.left = await insertBSTNodeAnimated(node.left, value, runId);
    } else if (value > node.value) {
        node.highlight = 'searching';
        node.right = await insertBSTNodeAnimated(node.right, value, runId);
    }

    node.highlight = null;
    return node;
}

function searchBST() {
    const input = document.getElementById('bstInput').value;
    const value = parseInt(input);

    if (isNaN(value)) {
        logBST("Please enter a valid number to search");
        return;
    }

    resetStats();
    highlightBSTSearch(value);
    logBST(`Searching for: ${value} `);
}

function highlightBSTSearch(value) {
    clearBSTHighlights();
    let current = bstRoot;
    let found = false;

    function search(node, parentDiv) {
        if (!node || !parentDiv) return;

        algorithmStats.rotations++; // Steps
        algorithmStats.comparisons++;
        updateStatsDisplay();

        const nodeDiv = parentDiv.querySelector(`[data - value= "${node.value}"]`);
        if (nodeDiv) {
            nodeDiv.classList.add('searching');

            setTimeout(() => {
                if (node.value === value) {
                    nodeDiv.classList.remove('searching');
                    nodeDiv.classList.add('found');
                    logBST(`Found: ${value} `);
                    found = true;
                } else {
                    nodeDiv.classList.remove('searching');

                    if (value < node.value) {
                        search(node.left, nodeDiv.parentNode.querySelector('.left-child'));
                    } else {
                        search(node.right, nodeDiv.parentNode.querySelector('.right-child'));
                    }
                }
            }, bstSpeed);
        }
    }

    search(current, document.getElementById('bstVisualization'));

    setTimeout(() => {
        if (!found) {
            logBST(`${value} not found in BST`);
        }
    }, bstSpeed * 10);
}

function traverseInOrder() {
    const result = [];
    inOrderTraversal(bstRoot, result);
    logBST(`In - order Traversal: ${result.join(' → ')} `);
    highlightTraversal(result, 'inorder');
}

function traversePreOrder() {
    const result = [];
    preOrderTraversal(bstRoot, result);
    logBST(`Pre - order Traversal: ${result.join(' → ')} `);
    highlightTraversal(result, 'preorder');
}

function traversePostOrder() {
    const result = [];
    postOrderTraversal(bstRoot, result);
    logBST(`Post - order Traversal: ${result.join(' → ')} `);
    highlightTraversal(result, 'postorder');
}

function inOrderTraversal(node, result) {
    if (!node) return;
    inOrderTraversal(node.left, result);
    result.push(node.value);
    inOrderTraversal(node.right, result);
}

function preOrderTraversal(node, result) {
    if (!node) return;
    result.push(node.value);
    preOrderTraversal(node.left, result);
    preOrderTraversal(node.right, result);
}

function postOrderTraversal(node, result) {
    if (!node) return;
    postOrderTraversal(node.left, result);
    postOrderTraversal(node.right, result);
    result.push(node.value);
}

function highlightTraversal(values, type) {
    clearBSTHighlights();
    let index = 0;

    function highlightNext() {
        if (index >= values.length) return;

        const nodeDiv = document.querySelector(`.tree - node[data - value="${values[index]}"]`);
        if (nodeDiv) {
            nodeDiv.classList.add('traversing');

            setTimeout(() => {
                nodeDiv.classList.remove('traversing');
                nodeDiv.classList.add('visited');
                index++;
                highlightNext();
            }, bstSpeed);
        }
    }

    highlightNext();
}

function deleteBST() {
    const input = document.getElementById('bstInput').value;
    const value = parseInt(input);

    if (isNaN(value)) {
        logBST("Please enter a valid number to delete");
        return;
    }

    bstRoot = deleteBSTNode(bstRoot, value);
    updateBSTVisualization();
    logBST(`Deleted: ${value} `);
    document.getElementById('bstInput').value = '';
}

function deleteBSTNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
        node.left = deleteBSTNode(node.left, value);
    } else if (value > node.value) {
        node.right = deleteBSTNode(node.right, value);
    } else {
        // Node found
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Node with two children
        const minRight = findMin(node.right);
        node.value = minRight.value;
        node.right = deleteBSTNode(node.right, minRight.value);
    }

    return node;
}

function findMin(node) {
    while (node.left) node = node.left;
    return node;
}

function resetBST() {
    bstRoot = null;
    updateBSTVisualization();
    logBST("BST reset successfully");
}

function updateBSTSpeed() {
    bstSpeed = document.getElementById('bstSpeed').value;
}

function updateBSTVisualization() {
    const container = document.getElementById('bstVisualization');
    if (!container) return;

    container.innerHTML = '';

    if (!bstRoot) {
        container.innerHTML = '<p class="empty-tree">Tree is empty. Insert values to build BST.</p>';
        return;
    }

    // Create SVG for arrows
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "1";
    container.appendChild(svg);

    const treeContainer = document.createElement('div');
    treeContainer.className = 'tree-nodes-container';
    treeContainer.style.position = "relative";
    treeContainer.style.width = "100%";
    treeContainer.style.height = "100%";
    treeContainer.style.zIndex = "2";
    container.appendChild(treeContainer);

    const nodeWidth = 50;
    const levelHeight = 80;
    const initialGap = container.offsetWidth / 2;

    renderTreeNode(bstRoot, container.offsetWidth / 2, 40, initialGap, treeContainer, svg);
}

function renderTreeNode(node, x, y, gap, container, svg) {
    if (!node) return;

    // Create node element
    const nodeDiv = document.createElement('div');
    nodeDiv.className = `tree - node ${node.highlight || ''} `;
    nodeDiv.style.left = `${x} px`;
    nodeDiv.style.top = `${y} px`;
    nodeDiv.setAttribute('data-value', node.value);

    const valueDiv = document.createElement('div');
    valueDiv.className = 'node-value';
    valueDiv.textContent = node.value;
    nodeDiv.appendChild(valueDiv);

    container.appendChild(nodeDiv);

    const nextGap = gap / 2;
    const nextY = y + 100;

    if (node.left) {
        const nextX = x - gap / 1.5;
        drawTreeArrow(x, y, nextX, nextY, svg);
        renderTreeNode(node.left, nextX, nextY, nextGap, container, svg);
    }

    if (node.right) {
        const nextX = x + gap / 1.5;
        drawTreeArrow(x, y, nextX, nextY, svg);
        renderTreeNode(node.right, nextX, nextY, nextGap, container, svg);
    }
}

function drawTreeArrow(x1, y1, x2, y2, svg) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    // Node radius is 25px (50px width).
    // Start from bottom of parent, end at top of child (plus cushion for arrowhead)
    const startY = y1 + 25;
    const endY = y2 - 25;

    line.setAttribute("x1", x1);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", "#34495e"); // Dark gray/blue for visibility
    line.setAttribute("stroke-width", "2");
    line.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(line);

    // Ensure arrowhead marker exists
    if (!document.getElementById('arrowhead')) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "9"); // Position tip at end of line
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
        polygon.setAttribute("fill", "#34495e"); // Match line color
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);
    }
}

function clearBSTHighlights() {
    document.querySelectorAll('.tree-node').forEach(node => {
        node.classList.remove('searching', 'found', 'traversing', 'visited');
    });
}

function logBST(message) {
    const log = document.getElementById('bstLog');
    if (!log) return;

    const step = document.createElement('div');
    step.className = 'step';
    step.textContent = `[${new Date().toLocaleTimeString()}] ${message} `;
    log.appendChild(step);
    log.scrollTop = log.scrollHeight;
}

function showBST() {
    currentAlgorithm = 'bst';
    if (typeof addBackButton === 'function') {
        addBackButton();
    }

    document.getElementById('algorithmContent').innerHTML = `
    < h3 > Binary Search Tree(BST) Visualization</h3 >
        
        <div class="input-group">
            <input type="text" id="bstInput" placeholder="Enter value (comma separated)">
            <button class="control-btn" onclick="insertBST()">Insert</button>
            <button class="control-btn" onclick="deleteBST()">Delete</button>
            <button class="control-btn" onclick="searchBST()">Search</button>
            <button class="control-btn stop" onclick="stopVisualization()" id="stopBtn">Stop</button>
            <button class="control-btn resume" onclick="resumeVisualization()" id="resumeBtn" disabled>Resume</button>
            <button class="control-btn reset" onclick="resetBST()">Reset Tree</button>
        </div>
        
        <div class="speed-control">
            <label>Animation Speed:</label>
            <input type="range" id="bstSpeed" min="100" max="2000" value="500" onchange="updateBSTSpeed()">
        </div>
        
        <div class="formula-section">
            <h4>Key Logic / Formula:</h4>
            <code>Left < Root < Right</code>
        </div>

        <div id="algorithmStats" class="stats-panel">
            <span><strong>Steps/Passes:</strong> 0</span>
            <span><strong>Comparisons:</strong> 0</span>
        </div>

        <div class="structure-container" id="bstContainer">
            <div id="bstVisualization" class="tree-container"></div>
        </div>
        
        <div class="info-panel">
            <h4>BST Operations:</h4>
            <p>• Insert: Add a new node while maintaining BST property</p>
            <p>• Search: Find a value in the tree (O(log n) average)</p>
            <p>• Delete: Remove a node while maintaining BST property</p>
            <p>• Traversals: In-order, Pre-order, Post-order</p>
        </div>
        
        <div class="controls">
            <button class="control-btn" onclick="traverseInOrder()">In-order Traversal</button>
            <button class="control-btn" onclick="traversePreOrder()">Pre-order Traversal</button>
            <button class="control-btn" onclick="traversePostOrder()">Post-order Traversal</button>
        </div>
        
        <div class="steps-container" id="bstSteps">
            <h4>BST Operations Log:</h4>
            <div id="bstLog"></div>
        </div>
        
        <div class="code-snippet">
            <pre><code>${getBSTCode()}</code></pre>
        </div>
`;

    initBST();
}

// AVL Tree Implementation
let avlRoot = null;
let avlSpeed = 500;

class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

function initAVL() {
    avlRoot = null;
    updateAVLVisualization();
    logAVL("AVL Tree initialized. Enter values to insert.");
}

async function insertAVL() {
    const input = document.getElementById('avlInput').value;
    if (!input) {
        logAVL("Please enter a value");
        return;
    }

    const values = input.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length === 0) return;

    if (isAnimating) return;
    currentRunId++;
    const runId = currentRunId;
    isAnimating = true;
    isPaused = false;
    resetStats();

    for (const value of values) {
        logAVL(`Starting insertion of: ${value} `);
        avlRoot = await insertAVLNodeAnimated(avlRoot, value, runId);
        updateAVLVisualization();
        logAVL(`Finished insertion of: ${value} `);
    }

    isAnimating = false;
    document.getElementById('avlInput').value = '';
}

async function insertAVLNodeAnimated(node, value, runId) {
    if (!node) return new AVLNode(value);

    algorithmStats.comparisons++;
    algorithmStats.rotations++; // Steps
    updateStatsDisplay();

    // Highlight current node
    node.highlight = 'searching';
    updateAVLVisualization();
    if (await sleep(avlSpeed, runId)) return node;

    if (value < node.value) {
        node.left = await insertAVLNodeAnimated(node.left, value, runId);
    } else if (value > node.value) {
        node.right = await insertAVLNodeAnimated(node.right, value, runId);
    } else {
        node.highlight = null;
        updateAVLVisualization();
        return node; // No duplicates
    }

    node.highlight = null;

    // Update height
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

    // Get balance factor
    const balance = getBalance(node);

    // Rebalance if needed
    if (balance > 1 && value < node.left.value) {
        logAVL(`Right Rotation on ${node.value} `);
        algorithmStats.rotations++;
        updateStatsDisplay();
        return rightRotate(node);
    }

    if (balance < -1 && value > node.right.value) {
        logAVL(`Left Rotation on ${node.value} `);
        algorithmStats.rotations++;
        updateStatsDisplay();
        return leftRotate(node);
    }

    if (balance > 1 && value > node.left.value) {
        logAVL(`Left - Right Rotation on ${node.value} `);
        algorithmStats.rotations++;
        updateStatsDisplay();
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
        logAVL("Performing Right-Left Rotation (RL Case)");
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

function getHeight(node) {
    return node ? node.height : 0;
}

function getBalance(node) {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function leftRotate(x) {
    algorithmStats.rotations++;
    updateStatsDisplay();
    const y = x.right;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));

    return y;
}

function rightRotate(y) {
    algorithmStats.rotations++;
    updateStatsDisplay();
    const x = y.left;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));

    return x;
}

function showRotations() {
    logAVL("Rotation Examples:");
    logAVL("1. Right Rotation (LL Case): When left subtree is too heavy");
    logAVL("2. Left Rotation (RR Case): When right subtree is too heavy");
    logAVL("3. Left-Right Rotation (LR Case): Left child's right subtree heavy");
    logAVL("4. Right-Left Rotation (RL Case): Right child's left subtree heavy");
}

function checkBalanceFactors() {
    if (!avlRoot) {
        logAVL("Tree is empty");
        return;
    }

    function check(node) {
        if (!node) return;

        const balance = getBalance(node);
        logAVL(`Node ${node.value}: Balance factor = ${balance} ${Math.abs(balance) > 1 ? '(UNBALANCED!)' : '(balanced)'} `);

        check(node.left);
        check(node.right);
    }

    check(avlRoot);
}

function updateAVLVisualization() {
    const container = document.getElementById('avlVisualization');
    if (!container) return;

    container.innerHTML = '';

    if (!avlRoot) {
        container.innerHTML = '<p class="empty-tree">Tree is empty. Insert values to build AVL Tree.</p>';
        return;
    }

    // Create SVG for arrows
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "1";
    container.appendChild(svg);

    const treeContainer = document.createElement('div');
    treeContainer.className = 'tree-nodes-container';
    treeContainer.style.position = "relative";
    treeContainer.style.width = "100%";
    treeContainer.style.height = "100%";
    treeContainer.style.zIndex = "2";
    container.appendChild(treeContainer);

    const initialGap = container.offsetWidth / 2;

    renderAVLTreeNode(avlRoot, container.offsetWidth / 2, 40, initialGap, treeContainer, svg);
}

function renderAVLTreeNode(node, x, y, gap, container, svg) {
    if (!node) return;

    const balance = getBalance(node);
    const balanceClass = Math.abs(balance) > 1 ? 'unbalanced' : 'balanced';

    // Create node element
    const nodeDiv = document.createElement('div');
    nodeDiv.className = `tree - node avl - node ${balanceClass} ${node.highlight || ''} `;
    nodeDiv.style.left = `${x} px`;
    nodeDiv.style.top = `${y} px`;
    nodeDiv.setAttribute('data-value', node.value);

    const valueDiv = document.createElement('div');
    valueDiv.className = 'node-value';
    valueDiv.innerHTML = `${node.value} <div class="balance-factor">BF: ${balance}</div>`;
    nodeDiv.appendChild(valueDiv);

    container.appendChild(nodeDiv);

    const nextGap = gap / 2;
    const nextY = y + 100;

    if (node.left) {
        const nextX = x - gap / 1.5;
        drawTreeArrow(x, y, nextX, nextY, svg);
        renderAVLTreeNode(node.left, nextX, nextY, nextGap, container, svg);
    }

    if (node.right) {
        const nextX = x + gap / 1.5;
        drawTreeArrow(x, y, nextX, nextY, svg);
        renderAVLTreeNode(node.right, nextX, nextY, nextGap, container, svg);
    }
}

function logAVL(message) {
    const log = document.getElementById('avlLog');
    if (!log) return;

    const step = document.createElement('div');
    step.className = 'step';
    step.textContent = `[${new Date().toLocaleTimeString()}] ${message} `;
    log.appendChild(step);
    log.scrollTop = log.scrollHeight;
}

function resetAVL() {
    avlRoot = null;
    updateAVLVisualization();
    logAVL("AVL Tree reset successfully");
}

function updateAVLSpeed() {
    avlSpeed = document.getElementById('avlSpeed').value;
}

function showAVL() {
    currentAlgorithm = 'avl';
    if (typeof addBackButton === 'function') {
        addBackButton();
    }

    document.getElementById('algorithmContent').innerHTML = `
    < h3 > AVL Tree Visualization</h3 >
        
        <div class="input-group">
            <input type="text" id="avlInput" placeholder="Enter value (comma separated)">
            <button class="control-btn" onclick="insertAVL()">Insert</button>
            <button class="control-btn" onclick="deleteAVL()">Delete</button>
            <button class="control-btn" onclick="balanceAVL()">Check Balance</button>
            <button class="control-btn stop" onclick="stopVisualization()" id="stopBtn">Stop</button>
            <button class="control-btn resume" onclick="resumeVisualization()" id="resumeBtn" disabled>Resume</button>
            <button class="control-btn reset" onclick="resetAVL()">Reset Tree</button>
        </div>
        
        <div class="speed-control">
            <label>Animation Speed:</label>
            <input type="range" id="avlSpeed" min="100" max="2000" value="500" onchange="updateAVLSpeed()">
        </div>
        
        <div class="formula-section">
            <h4>Key Logic / Formula:</h4>
            <code>BF = h(L) - h(R) | |BF| ≤ 1</code>
        </div>

        <div id="algorithmStats" class="stats-panel">
            <span><strong>Rotations:</strong> 0</span>
            <span><strong>Comparisons:</strong> 0</span>
        </div>

        <div class="structure-container" id="avlContainer">
            <div id="avlVisualization" class="tree-container"></div>
        </div>
        
        <div class="info-panel">
            <h4>AVL Tree Properties:</h4>
            <p>• Self-balancing Binary Search Tree</p>
            <p>• Height difference between left and right subtrees ≤ 1</p>
            <p>• Rotations: Left, Right, Left-Right, Right-Left</p>
            <p>• Guaranteed O(log n) for all operations</p>
        </div>
        
        <div class="controls">
            <button class="control-btn" onclick="showRotations()">Show Rotations</button>
            <button class="control-btn" onclick="checkBalanceFactors()">Show Balance Factors</button>
        </div>
        
        <div class="steps-container" id="avlSteps">
            <h4>AVL Operations Log:</h4>
            <div id="avlLog"></div>
        </div>
        
        <div class="code-snippet">
            <pre><code>${getAVLCode()}</code></pre>
        </div>
`;

    initAVL();
}

// ==================== QUEUE SELECTION ====================

function showQueueSelection() {
    if (typeof addBackButton === 'function') {
        addBackButton();
    }

    document.getElementById('algorithmContent').innerHTML = `
    < h3 > Queue Types</h3 >
        
        <div class="info-panel">
            <h4>Select Queue Type:</h4>
            <p><strong>Linear Queue:</strong> Simple FIFO queue with linear structure</p>
            <p><strong>Circular Queue:</strong> Efficient queue that reuses empty spaces</p>
        </div>
        
        <div class="controls" style="justify-content: center; margin-top: 40px;">
            <button class="control-btn" style="min-width: 200px; font-size: 18px; padding: 20px;" onclick="showLinearQueue()">
                Linear Queue
            </button>
            <button class="control-btn" style="min-width: 200px; font-size: 18px; padding: 20px;" onclick="showCircularQueue()">
                Circular Queue
            </button>
        </div>
        
        <div class="info-panel" style="margin-top: 30px;">
            <h4>Comparison:</h4>
            <p><strong>Linear Queue:</strong> Simple implementation, but can waste space</p>
            <p><strong>Circular Queue:</strong> More complex, but efficient memory usage</p>
        </div>
`;
}

function showLinearQueue() {
    // Update active button
    document.querySelectorAll('.dsa-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activate Queue button
    const queueBtn = document.querySelector('.dsa-btn[onclick="showQueueSelection()"]');
    if (queueBtn) {
        queueBtn.classList.add('active');
    }

    // Show the linear queue visualization
    showAlgorithm('queue');

    // Override back button to go to queue selection
    if (typeof addBackButton === 'function') {
        addBackButton(showQueueSelection);
    }
}

// ==================== CIRCULAR QUEUE ====================

// Circular Queue Implementation
let circularQueue = [];
let front = -1;
let rear = -1;
let queueSize = 8; // Default size
let queueSpeed = 500;

function showCircularQueue() {
    currentAlgorithm = 'circularqueue';
    if (typeof addBackButton === 'function') {
        addBackButton(showQueueSelection);
    }

    document.getElementById('algorithmContent').innerHTML = `
    < h3 > Circular Queue Visualization</h3 >
        
        <div class="input-group">
            <input type="number" id="queueSize" placeholder="Queue Size (3-15)" min="3" max="15" value="8">
            <button class="control-btn" onclick="initCircularQueue()">Initialize Queue</button>
        </div>
        
        <div class="input-group">
            <input type="text" id="queueInput" placeholder="Enter value to enqueue">
            <button class="control-btn" onclick="enqueueCircular()">Enqueue</button>
            <button class="control-btn" onclick="dequeueCircular()">Dequeue</button>
            <button class="control-btn reset" onclick="resetCircularQueue()">Reset</button>
        </div>
        
        <div class="speed-control">
            <label>Animation Speed:</label>
            <input type="range" id="queueSpeed" min="100" max="2000" value="500" onchange="updateQueueSpeed()">
        </div>
        
        <div class="structure-container" id="queueContainer">
            <div id="circularQueueVisualization" class="circular-queue-container"></div>
            
            <div class="queue-pointers">
                <div class="pointer front-pointer">
                    <div class="pointer-label">FRONT</div>
                    <div class="pointer-arrow">↓</div>
                    <div id="frontIndex" class="pointer-value">-1</div>
                </div>
                
                <div class="pointer rear-pointer">
                    <div class="pointer-label">REAR</div>
                    <div class="pointer-arrow">↓</div>
                    <div id="rearIndex" class="pointer-value">-1</div>
                </div>
            </div>
        </div>
        
        <div class="queue-info-panel">
            <div class="queue-stats">
                <div class="stat">
                    <span class="stat-label">Size:</span>
                    <span id="queueSizeValue" class="stat-value">8</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Count:</span>
                    <span id="queueCount" class="stat-value">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Status:</span>
                    <span id="queueStatus" class="stat-value">Empty</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Free Space:</span>
                    <span id="freeSpace" class="stat-value">8</span>
                </div>
            </div>
        </div>
        
        <div class="info-panel">
            <h4>Circular Queue Operations:</h4>
            <p>• <strong>Enqueue</strong>: Add element at REAR position (circular increment)</p>
            <p>• <strong>Dequeue</strong>: Remove element from FRONT position (circular increment)</p>
            <p>• <strong>Circular Nature</strong>: When REAR reaches end, it wraps around to beginning</p>
            <p>• <strong>Conditions</strong>: FRONT == -1 means empty, (REAR+1)%size == FRONT means full</p>
        </div>
        
        <div class="controls">
            <button class="control-btn" onclick="peekFrontCircular()">Peek Front</button>
            <button class="control-btn" onclick="peekRearCircular()">Peek Rear</button>
            <button class="control-btn" onclick="checkEmptyCircular()">Check Empty</button>
            <button class="control-btn" onclick="checkFullCircular()">Check Full</button>
            <button class="control-btn" onclick="displayQueueCircular()">Display Queue</button>
        </div>
        
        <div class="steps-container" id="queueSteps">
            <h4>Queue Operations Log:</h4>
            <div id="queueLog"></div>
        </div>
        
        <div class="code-snippet">
            <h4>Circular Queue Algorithm:</h4>
            <pre><code>
<span class="keyword">function</span> <span class="function">enqueue</span>(value) {
    <span class="keyword">if</span> (<span class="function">isFull</span>()) {
        <span class="keyword">return</span> <span class="string">"Queue Overflow"</span>;
    }
    <span class="keyword">if</span> (front == <span class="number">-1</span>) {
        front = <span class="number">0</span>;
    }
    rear = (rear + <span class="number">1</span>) % size;
    queue[rear] = value;
}

<span class="keyword">function</span> <span class="function">dequeue</span>() {
    <span class="keyword">if</span> (<span class="function">isEmpty</span>()) {
        <span class="keyword">return</span> <span class="string">"Queue Underflow"</span>;
    }
    value = queue[front];
    <span class="keyword">if</span> (front == rear) {
        front = rear = <span class="number">-1</span>;
    } <span class="keyword">else</span> {
        front = (front + <span class="number">1</span>) % size;
    }
    <span class="keyword">return</span> value;
}
            </code></pre>
        </div>
`;

    initCircularQueue();
}

function initCircularQueue() {
    const sizeInput = document.getElementById('queueSize').value;
    queueSize = parseInt(sizeInput) || 8;

    if (queueSize < 3) queueSize = 3;
    if (queueSize > 15) queueSize = 15;

    circularQueue = new Array(queueSize).fill(null);
    front = -1;
    rear = -1;

    updateCircularQueueVisualization();
    updateCircularQueueStats();
    logQueue(`Circular Queue initialized with size ${queueSize} `);
}

function updateQueueSpeed() {
    queueSpeed = document.getElementById('queueSpeed').value;
}

function enqueueCircular() {
    const input = document.getElementById('queueInput').value;
    if (!input) {
        logQueue("Please enter a value to enqueue");
        return;
    }

    const value = parseInt(input);
    if (isNaN(value)) {
        logQueue("Please enter a valid number");
        return;
    }

    if (isQueueFull()) {
        logQueue(`Queue Overflow! Cannot enqueue ${value} - Queue is full`);
        highlightQueueFull();
        return;
    }

    // Visual feedback for enqueue
    highlightEnqueuePosition();

    setTimeout(() => {
        if (front === -1) {
            front = 0;
        }

        rear = (rear + 1) % queueSize;
        circularQueue[rear] = value;

        updateCircularQueueVisualization();
        updateCircularQueueStats();
        logQueue(`Enqueued: ${value} at position ${rear} `);

        // Clear input
        document.getElementById('queueInput').value = '';
    }, queueSpeed);
}

function dequeueCircular() {
    if (isQueueEmpty()) {
        logQueue("Queue Underflow! Cannot dequeue - Queue is empty");
        highlightQueueEmpty();
        return;
    }

    // Visual feedback for dequeue
    highlightDequeuePosition();

    setTimeout(() => {
        const value = circularQueue[front];

        if (front === rear) {
            // Queue becomes empty
            circularQueue[front] = null;
            front = -1;
            rear = -1;
        } else {
            circularQueue[front] = null;
            front = (front + 1) % queueSize;
        }

        updateCircularQueueVisualization();
        updateCircularQueueStats();
        logQueue(`Dequeued: ${value} from position ${front === -1 ? 'N/A' : (front === 0 ? rear : (front - 1 + queueSize) % queueSize)} `);
    }, queueSpeed);
}

function peekFrontCircular() {
    if (isQueueEmpty()) {
        logQueue("Queue is empty! Cannot peek");
        return;
    }

    highlightFrontPosition();
    logQueue(`Front element: ${circularQueue[front]} at position ${front} `);

    setTimeout(() => {
        clearQueueHighlights();
    }, queueSpeed);
}

function peekRearCircular() {
    if (isQueueEmpty()) {
        logQueue("Queue is empty! Cannot peek");
        return;
    }

    highlightRearPosition();
    logQueue(`Rear element: ${circularQueue[rear]} at position ${rear} `);

    setTimeout(() => {
        clearQueueHighlights();
    }, queueSpeed);
}

function checkEmptyCircular() {
    if (isQueueEmpty()) {
        logQueue("Queue is EMPTY");
        highlightQueueEmpty();
    } else {
        logQueue("Queue is NOT empty");
    }

    setTimeout(() => {
        clearQueueHighlights();
    }, queueSpeed * 2);
}

function checkFullCircular() {
    if (isQueueFull()) {
        logQueue("Queue is FULL");
        highlightQueueFull();
    } else {
        logQueue("Queue is NOT full");
    }

    setTimeout(() => {
        clearQueueHighlights();
    }, queueSpeed * 2);
}

function displayQueueCircular() {
    let queueElements = [];
    if (!isQueueEmpty()) {
        let i = front;
        while (true) {
            queueElements.push(circularQueue[i]);
            if (i === rear) break;
            i = (i + 1) % queueSize;
        }
    }
    logQueue(`Queue elements: [${queueElements.join(', ') || 'Empty'}]`);

    // Highlight all occupied positions
    highlightAllOccupiedPositions();

    setTimeout(() => {
        clearQueueHighlights();
    }, queueSpeed * 3);
}

function isQueueEmpty() {
    return front === -1;
}

function isQueueFull() {
    return (rear + 1) % queueSize === front;
}

function getQueueCount() {
    if (isQueueEmpty()) return 0;
    if (rear >= front) return rear - front + 1;
    return queueSize - front + rear + 1;
}

function updateCircularQueueStats() {
    const count = getQueueCount();
    const freeSpace = queueSize - count;
    const status = isQueueEmpty() ? 'Empty' : isQueueFull() ? 'Full' : 'Partially Full';

    document.getElementById('queueSizeValue').textContent = queueSize;
    document.getElementById('queueCount').textContent = count;
    document.getElementById('queueStatus').textContent = status;
    document.getElementById('freeSpace').textContent = freeSpace;

    // Update pointer values
    document.getElementById('frontIndex').textContent = front;
    document.getElementById('rearIndex').textContent = rear;
}

function updateCircularQueueVisualization() {
    const container = document.getElementById('circularQueueVisualization');
    if (!container) return;

    container.innerHTML = '';
    container.className = 'circular-queue-container';

    // Create circular layout
    const containerWidth = container.offsetWidth || 400;
    const centerX = containerWidth / 2;
    const centerY = 150;
    const radius = Math.min(containerWidth / 2 - 40, 120);

    for (let i = 0; i < queueSize; i++) {
        const angle = (i * 2 * Math.PI) / queueSize - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const cell = document.createElement('div');
        cell.className = 'queue-cell';
        cell.style.position = 'absolute';
        cell.style.left = `${x} px`;
        cell.style.top = `${y} px`;
        cell.style.transform = 'translate(-50%, -50%)';

        // Add cell number
        const cellNumber = document.createElement('div');
        cellNumber.className = 'cell-number';
        cellNumber.textContent = i;
        cell.appendChild(cellNumber);

        // Add cell value
        const cellValue = document.createElement('div');
        cellValue.className = 'cell-value';
        cellValue.textContent = circularQueue[i] !== null ? circularQueue[i] : '';

        if (circularQueue[i] !== null) {
            cellValue.classList.add('occupied');
        }

        if (i === front && front !== -1) {
            cellValue.classList.add('front-cell');
        }

        if (i === rear && rear !== -1) {
            cellValue.classList.add('rear-cell');
        }

        cell.appendChild(cellValue);

        // Add arrows showing circular connection
        if (i < queueSize - 1) {
            const nextAngle = ((i + 1) * 2 * Math.PI) / queueSize - Math.PI / 2;
            const nextX = centerX + radius * Math.cos(nextAngle);
            const nextY = centerY + radius * Math.sin(nextAngle);

            const arrow = document.createElement('div');
            arrow.className = 'queue-arrow';
            arrow.style.position = 'absolute';
            arrow.style.left = `${x} px`;
            arrow.style.top = `${y} px`;
            arrow.style.width = `${Math.sqrt(Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2))} px`;
            arrow.style.transform = `rotate(${Math.atan2(nextY - y, nextX - x)}rad)`;
            arrow.style.transformOrigin = '0 0';

            container.appendChild(arrow);
        }

        container.appendChild(cell);
    }

    // Add last arrow from last to first if queue is not empty
    if (!isQueueEmpty() && rear !== front) {
        const lastAngle = ((queueSize - 1) * 2 * Math.PI) / queueSize - Math.PI / 2;
        const firstAngle = (0 * 2 * Math.PI) / queueSize - Math.PI / 2;
        const lastX = centerX + radius * Math.cos(lastAngle);
        const lastY = centerY + radius * Math.sin(lastAngle);
        const firstX = centerX + radius * Math.cos(firstAngle);
        const firstY = centerY + radius * Math.sin(firstAngle);

        const arrow = document.createElement('div');
        arrow.className = 'queue-arrow circular-arrow';
        arrow.style.position = 'absolute';
        arrow.style.left = `${lastX} px`;
        arrow.style.top = `${lastY} px`;
        arrow.style.width = `${Math.sqrt(Math.pow(firstX - lastX, 2) + Math.pow(firstY - lastY, 2))} px`;
        arrow.style.transform = `rotate(${Math.atan2(firstY - lastY, firstX - lastX)}rad)`;
        arrow.style.transformOrigin = '0 0';

        container.appendChild(arrow);
    }
}

function highlightEnqueuePosition() {
    clearQueueHighlights();

    if (isQueueEmpty()) {
        // First element - position 0
        setTimeout(() => {
            const cells = document.querySelectorAll('.queue-cell');
            if (cells[0]) {
                cells[0].classList.add('highlight-enqueue');
            }
        }, 10);
    } else {
        const nextRear = (rear + 1) % queueSize;
        setTimeout(() => {
            const cells = document.querySelectorAll('.queue-cell');
            if (cells[nextRear]) {
                cells[nextRear].classList.add('highlight-enqueue');
            }
        }, 10);
    }
}

function highlightDequeuePosition() {
    clearQueueHighlights();

    setTimeout(() => {
        const cells = document.querySelectorAll('.queue-cell');
        if (cells[front]) {
            cells[front].classList.add('highlight-dequeue');
        }
    }, 10);
}

function highlightFrontPosition() {
    clearQueueHighlights();

    setTimeout(() => {
        const cells = document.querySelectorAll('.queue-cell');
        if (cells[front]) {
            cells[front].classList.add('highlight-front');
        }
    }, 10);
}

function highlightRearPosition() {
    clearQueueHighlights();

    setTimeout(() => {
        const cells = document.querySelectorAll('.queue-cell');
        if (cells[rear]) {
            cells[rear].classList.add('highlight-rear');
        }
    }, 10);
}

function highlightQueueEmpty() {
    const container = document.getElementById('circularQueueVisualization');
    if (container) {
        container.classList.add('queue-empty');
    }
}

function highlightQueueFull() {
    const container = document.getElementById('circularQueueVisualization');
    if (container) {
        container.classList.add('queue-full');
    }
}

function highlightAllOccupiedPositions() {
    if (isQueueEmpty()) return;

    let i = front;
    while (true) {
        const cells = document.querySelectorAll('.queue-cell');
        if (cells[i]) {
            cells[i].classList.add('highlight-occupied');
        }

        if (i === rear) break;
        i = (i + 1) % queueSize;
    }
}

function clearQueueHighlights() {
    const container = document.getElementById('circularQueueVisualization');
    if (container) {
        container.classList.remove('queue-empty', 'queue-full');
    }

    document.querySelectorAll('.queue-cell').forEach(cell => {
        cell.classList.remove('highlight-enqueue', 'highlight-dequeue', 'highlight-front',
            'highlight-rear', 'highlight-occupied');
    });
}

function resetCircularQueue() {
    circularQueue = new Array(queueSize).fill(null);
    front = -1;
    rear = -1;
    updateCircularQueueVisualization();
    updateCircularQueueStats();
    logQueue("Circular Queue has been reset");
}

function logQueue(message) {
    const log = document.getElementById('queueLog');
    if (!log) return;

    const step = document.createElement('div');
    step.className = 'step';
    step.textContent = `[${new Date().toLocaleTimeString()}] ${message} `;
    log.appendChild(step);
    log.scrollTop = log.scrollHeight;
}

// ==================== AVL TREE FUNCTIONS ====================

function deleteAVL() {
    const input = document.getElementById('avlInput').value;
    const value = parseInt(input);

    if (isNaN(value)) {
        logAVL("Please enter a valid number to delete");
        return;
    }

    avlRoot = deleteAVLNode(avlRoot, value);
    updateAVLVisualization();
    logAVL(`Deleted: ${value} `);
    document.getElementById('avlInput').value = '';
}

function deleteAVLNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
        node.left = deleteAVLNode(node.left, value);
    } else if (value > node.value) {
        node.right = deleteAVLNode(node.right, value);
    } else {
        // Node found
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Node with two children
        const minRight = findMinAVL(node.right);
        node.value = minRight.value;
        node.right = deleteAVLNode(node.right, minRight.value);
    }

    // Update height
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

    // Get balance factor
    const balance = getBalance(node);

    // Perform rotations if needed
    // Left Left Case
    if (balance > 1 && getBalance(node.left) >= 0) {
        logAVL("Performing Right Rotation after deletion (LL Case)");
        return rightRotate(node);
    }

    // Left Right Case
    if (balance > 1 && getBalance(node.left) < 0) {
        logAVL("Performing Left-Right Rotation after deletion (LR Case)");
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && getBalance(node.right) <= 0) {
        logAVL("Performing Left Rotation after deletion (RR Case)");
        return leftRotate(node);
    }

    // Right Left Case
    if (balance < -1 && getBalance(node.right) > 0) {
        logAVL("Performing Right-Left Rotation after deletion (RL Case)");
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

function findMinAVL(node) {
    while (node.left) node = node.left;
    return node;
}

function balanceAVL() {
    checkBalanceFactors();
}

function getAVLCode() {
    return `// AVL Tree Node
class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// Get height of node
function getHeight(node) {
    return node ? node.height : 0;
}

// Get balance factor
function getBalance(node) {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

// Right rotation
function rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));

    return x;
}

// Left rotation
function leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));

    return y;
}

// Insert into AVL tree
function insertAVL(root, value) {
    if (!root) return new AVLNode(value);

    if (value < root.value) {
        root.left = insertAVL(root.left, value);
    } else if (value > root.value) {
        root.right = insertAVL(root.right, value);
    } else {
        return root; // No duplicates
    }

    // Update height
    root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));

    // Get balance factor
    const balance = getBalance(root);

    // Perform rotations if needed
    // Left Left Case
    if (balance > 1 && value < root.left.value) {
        return rightRotate(root);
    }

    // Right Right Case
    if (balance < -1 && value > root.right.value) {
        return leftRotate(root);
    }

    // Left Right Case
    if (balance > 1 && value > root.left.value) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }

    // Right Left Case
    if (balance < -1 && value < root.right.value) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }

    return root;
} `;
}

function getBSTCode() {
    return `// Binary Search Tree Node
class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.label = '';
    }
}

// Insert into BST
function insertBST(root, value) {
    if (!root) return new BSTNode(value);

    if (value < root.value) {
        root.left = insertBST(root.left, value);
    } else if (value > root.value) {
        root.right = insertBST(root.right, value);
    }

    return root;
}

// Search in BST
function searchBST(root, value) {
    if (!root || root.value === value) {
        return root;
    }

    if (value < root.value) {
        return searchBST(root.left, value);
    } else {
        return searchBST(root.right, value);
    }
}

// In-order traversal
function inOrderTraversal(root) {
    if (!root) return;
    inOrderTraversal(root.left);
    console.log(root.value);
    inOrderTraversal(root.right);
} `;
}

// ==================== INITIALIZATION ====================

// Initialize when page loads
window.onload = function () {
    // Generate initial array
    currentArray = generateArray(8);
    displayArray(currentArray);

    // Set up speed control
    updateSpeed();

    // Show default algorithm
    showAlgorithm('bubble');

    // Initialize data structures
    displayStack();
    displayLinkedList();
};