cmake_minimum_required(VERSION 3.18)
project(mmapeak CUDA CXX)

# Set CUDA standard
set(CMAKE_CUDA_STANDARD 17)
set(CMAKE_CUDA_STANDARD_REQUIRED ON)

# Find CUDA package
find_package(CUDA REQUIRED)

# Add CUDA executable
add_executable(mmapeak mmapeak.cu)

if(CMAKE_CUDA_COMPILER_VERSION VERSION_GREATER_EQUAL 12.8)
    message(STATUS "CUDA version is 12.8 or greater, adding up to sm_120a")
    set_target_properties(mmapeak PROPERTIES
        CUDA_ARCHITECTURES "75;80;86;89;90;120a")
else()
    message(STATUS "CUDA version is less than 12.8, adding up to sm_86")
    set_target_properties(mmapeak PROPERTIES
        CUDA_ARCHITECTURES "75;80;86")
endif()

# Set compiler flags
set_target_properties(mmapeak PROPERTIES
    CUDA_SEPARABLE_COMPILATION OFF)

target_compile_options(mmapeak PRIVATE $<$<COMPILE_LANGUAGE:CUDA>:-O2>)

# Install the executable
install(TARGETS mmapeak
    RUNTIME DESTINATION bin)
