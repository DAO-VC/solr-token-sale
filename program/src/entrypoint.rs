use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};
use std::{
    alloc::Layout,
 //   cell::RefCell,
    mem::{/* align_of, */ size_of},
    ptr::null_mut,
 //   rc::Rc,
    // Hide Result from bindgen gets confused about generics in non-generic type declarations
//result::Result as ResultGeneric,
 //   slice::{from_raw_parts, from_raw_parts_mut},
};

use crate::processor::Processor;
/// Start address of the memory region used for program heap.
pub const HEAP_START_ADDRESS: usize = 0x800000000;
/// Length of the heap memory region used for program heap.
pub const HEAP_LENGTH: usize = 32 * 1024;

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    crate::custom_heap!();
    Processor::process(program_id, accounts, instruction_data)

}
/// Fallback to default for unused custom heap feature.
#[macro_export]
macro_rules! custom_heap {
    () => {
        /// A program can provide their own custom heap implementation by adding
        /// a `custom-heap` feature to `Cargo.toml` and implementing their own
        /// `global_allocator`.
        ///
        /// If the program defines the feature `custom-heap` then the default heap
        /// implementation will not be included and the program is free to implement
        /// their own `#[global_allocator]`
   ///     #[cfg(all(not(feature = "custom-heap"), target_arch = "bpf"))]
        #[global_allocator]
        static A: crate::entrypoint::BumpAllocator = $crate::entrypoint::BumpAllocator {
            start: crate::entrypoint::HEAP_START_ADDRESS,
            len: crate::entrypoint::HEAP_LENGTH,
        };
    };
}
/// The bump allocator used as the default rust heap when running programs.
pub struct BumpAllocator {
    pub start: usize,
    pub len: usize,
}
unsafe impl std::alloc::GlobalAlloc for BumpAllocator {
    #[inline]
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let pos_ptr = self.start as *mut usize;

        let mut pos = *pos_ptr;
        if pos == 0 {
            // First time, set starting position
            pos = self.start + self.len;
        }
        pos = pos.saturating_sub(layout.size());
        pos &= !(layout.align().wrapping_sub(1));
        if pos < self.start + size_of::<*mut u8>() {
            return null_mut();
        }
        *pos_ptr = pos;
        pos as *mut u8
    }
    #[inline]
    unsafe fn dealloc(&self, _: *mut u8, _: Layout) {
        // I'm a bump allocator, I don't free
    }
}

