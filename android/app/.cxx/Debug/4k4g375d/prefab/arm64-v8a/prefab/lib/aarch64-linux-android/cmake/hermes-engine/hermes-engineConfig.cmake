if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/sahilwalke/.gradle/caches/8.13/transforms/bade7f51f9852dd98b778794d78fbbaf/transformed/hermes-android-0.79.0-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/sahilwalke/.gradle/caches/8.13/transforms/bade7f51f9852dd98b778794d78fbbaf/transformed/hermes-android-0.79.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

