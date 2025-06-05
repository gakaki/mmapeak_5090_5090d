#!/bin/bash

# Function to print error messages
print_error() {
    echo -e "\e[31mError: $1\e[0m"
}

# Function to print success messages
print_success() {
    echo -e "\e[32m$1\e[0m"
}

# Function to print info messages
print_info() {
    echo -e "\e[34m$1\e[0m"
}

# Setup CUDA environment
setup_cuda() {
    # Try to find CUDA installation
    if [ -d "/usr/local/cuda" ]; then
        CUDA_PATH="/usr/local/cuda"
    elif [ -d "/usr/cuda" ]; then
        CUDA_PATH="/usr/cuda"
    else
        print_error "CUDA installation not found in standard locations"
        exit 1
    fi

    # Export CUDA paths
    export PATH="${CUDA_PATH}/bin:${PATH}"
    export LD_LIBRARY_PATH="${CUDA_PATH}/lib64:${LD_LIBRARY_PATH}"
    export CUDA_HOME="${CUDA_PATH}"
}

# Check for required tools
check_requirements() {
    print_info "Checking requirements..."
    
    # Setup CUDA environment
    setup_cuda
    
    # Check for CUDA
    if ! command -v nvcc &> /dev/null; then
        print_error "CUDA compiler (nvcc) not found. Please install CUDA Toolkit."
        exit 1
    fi
    print_success "Found CUDA: $(nvcc --version | head -n1)"

    # Check for CMake
    if ! command -v cmake &> /dev/null; then
        print_error "CMake not found. Please install CMake."
        exit 1
    fi
    print_success "Found CMake: $(cmake --version | head -n1)"

    # Check for OpenCV
    if ! pkg-config --exists opencv4; then
        print_error "OpenCV not found. Please install OpenCV with: sudo apt-get install libopencv-dev"
        exit 1
    fi
    print_success "Found OpenCV: $(pkg-config --modversion opencv4)"
    export OpenCV_DIR=$(pkg-config --variable=prefix opencv4)/lib/cmake/opencv4

    # Check for C++ compiler
    if ! command -v g++ &> /dev/null; then
        print_error "g++ not found. Please install g++."
        exit 1
    fi
    print_success "Found g++: $(g++ --version | head -n1)"
}

# Clean previous build
clean_build() {
    print_info "Cleaning previous build..."
    rm -rf build
}

# Record start time
START_TIME=$(date +%s)

# Print banner
echo "================================================"
echo "           MMAPEAK Build Script"
echo "================================================"

# Check requirements
check_requirements

# Clean previous build
clean_build

# Create build directory
print_info "Setting up build directory..."
mkdir -p build
cd build || { print_error "Failed to enter build directory"; exit 1; }

# Configure CMake
print_info "Configuring CMake..."
cmake -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_CUDA_COMPILER="${CUDA_HOME}/bin/nvcc" \
      -DCMAKE_CXX_COMPILER=/usr/bin/g++ \
      -DOpenCV_DIR=${OpenCV_DIR} \
      .. || { print_error "CMake configuration failed"; exit 1; }

# Build the project
print_info "Building project..."
make -j$(nproc) || { print_error "Build failed"; exit 1; }

# Record end time and calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Print summary
echo "================================================"
echo "Build Summary:"
echo "Start time: $(date -d @${START_TIME})"
echo "End time: $(date -d @${END_TIME})"
echo "Total compilation time: ${DURATION} seconds"
echo "================================================"

if [ -f mmapeak ]; then
    print_success "Build completed successfully!"
    echo "You can now run the benchmark with: ./mmapeak"
else
    print_error "Build completed but executable not found."
    exit 1
fi 