<template>
  <v-app>
    <v-container>
      
      <!-- Menu top right  -->
      <v-menu style="position: fixed; top: 0; right: 0; min-width: 35vw;">
            <template v-slot:activator="{ props }">
              <v-btn style="position: fixed; top: 0; right: 0;" icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
            </template>

            <v-list style="min-width: 90vw;">
              <v-list-item>
                <v-switch
                v-model="autoScrollEnabled"
                label="Enable Auto-Scroll"
                @change="toggleAutoScroll"
              />
              </v-list-item>
              <v-list-item>
                <v-label>Scroll Speed: {{scrollSpeed}}</v-label>
                <v-slider
                v-model="scrollSpeed"
                min="0"
                max="100"
              />
              </v-list-item>
              <v-list-item>
                <v-label>Font Size: {{fontSize}}</v-label>
                <v-slider
                v-model="fontSize"
                min="4"
                max="40"
                step="1"
              />
              </v-list-item>
              <v-list-item>
                <v-btn @click="toggleTheme">toggle theme</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>

      <!-- Show Notes List -->
      <div v-if="currentView === 'list'">

        <h5 class="text-h5">Teleprompter Notes!</h5>
        <!-- Add New Note Button -->
      <v-btn class="sticky-top" @click="addNewNote">Add New Note</v-btn>

        <v-list>
          <v-list-item-group v-if="notes.length > 0">
            <v-list-item
              v-for="(note, index) in notes"
              :key="note.id"
              @click="viewNote(note)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ note.content.length > 30 ? note.content.slice(0, 30) + '...' : note.content }}
                </v-list-item-title>
              </v-list-item-content>

              <template v-slot:append>
                <v-btn @click.stop="confirmDelete(index)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
        </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>

      <!-- Show Note Details (Editable) -->
      <div v-if="currentView === 'note'">
        <v-btn @click="goBack" color="primary" class="mb-4">Back to List</v-btn>

        <!-- <v-row>
            <v-col>
              <v-switch
                v-model="autoScrollEnabled"
                label="Enable Auto-Scroll"
                @change="toggleAutoScroll"
              />
            </v-col>
            <v-col>
              <v-slider
                v-model="scrollSpeed"
                min="0"
                max="100"
                step="1"
                label="Scroll Speed"
                :label="`Speed: ${scrollSpeed}`"
              />
            </v-col>
          </v-row> -->
        
        <v-card>
          <v-card-text>
            <v-textarea
              :style="{ fontSize: fontSize + 'px', minHeight: '80vh' }"
              v-model="currentNote.content"
              label="Note Content"
              rows="10"
              auto-grow
              outlined
              @blur="saveNote"
              ref="noteTextarea" 
            />
          </v-card-text>
        </v-card>
      </div>

      <!-- Confirmation Dialog for Delete -->
      <v-dialog v-model="confirmDeleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Are you sure?</v-card-title>
          <v-card-text>
            <span>Do you really want to delete this note?</span>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="confirmDeleteDialog = false">Cancel</v-btn>
            <v-btn color="red" text @click="deleteNoteAndClose">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import storageService from './storageService';  // Correctly import storageService
import { useTheme } from 'vuetify'


// States to handle notes and views
const notes = ref([]);  // To hold the list of notes
const currentView = ref('list');  // Default to 'list' view
const currentNote = ref(null);  // Holds the currently selected note
const confirmDeleteDialog = ref(false);  // Dialog visibility for delete confirmation
const noteToDeleteIndex = ref(null);  // Index of the note to delete
const fontSize = ref(18); // Default font size
const theme = useTheme()


// Auto-scroll settings
const autoScrollEnabled = ref(false);  // Whether auto-scroll is enabled
const scrollSpeed = ref(50);  // Speed of scrolling (0 = very slow, 100 = medium speed)
let scrollInterval = null;  // Interval for auto-scroll
const noteTextarea = ref(null); // Define a ref for the textarea

// Async function to load notes
const loadNotes = async () => {
  notes.value = await storageService.loadNotes();  // Load notes from storage
};

// Load notes on mounted
onMounted(loadNotes);

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

// Add a new note to the list
const addNewNote = () => {
  const newNote = { id: Date.now(), content: '' };  // Create a note with empty content
  notes.value.push(newNote);  // Add to the list
  storageService.saveNotes(notes.value);  // Save to storage
  viewNote(newNote);  // Immediately show the new note in edit mode
};

// View a specific note
const viewNote = (note) => {
  currentNote.value = note;
  currentView.value = 'note';  // Switch to note detail view
};

// Go back to the notes list
const goBack = () => {
  currentView.value = 'list';  // Switch back to the list view
};

// Confirm delete and show dialog
const confirmDelete = (index) => {
  noteToDeleteIndex.value = index;  // Store the index of the note to delete
  confirmDeleteDialog.value = true;  // Show the confirmation dialog
};

// Delete the note and close the dialog
const deleteNoteAndClose = () => {
  deleteNote(noteToDeleteIndex.value);  // Delete the note
  confirmDeleteDialog.value = false;  // Close the confirmation dialog
};

// Delete a note
const deleteNote = (index) => {
  notes.value.splice(index, 1);
  storageService.saveNotes(notes.value);  // Save updated list to storage
};

// Save the note's content to storage when textarea loses focus
const saveNote = () => {
  storageService.saveNotes(notes.value);  // Save all notes to storage (including any changes to the current note)
};


// Auto-scroll function for the page (not just the textarea)
const autoScroll = () => {
  if (autoScrollEnabled.value) {
    clearInterval(scrollInterval);  // Clear any existing interval
    scrollInterval = setInterval(() => {
      // Scroll the entire page (or specific container)
      window.scrollBy(0, 1);  // Scroll down by 1 pixel
    }, 100 - scrollSpeed.value);  // Adjust the interval time based on scrollSpeed
  } else {
    clearInterval(scrollInterval);  // Disable auto-scroll
  }
};


// Toggle auto-scroll on or off
const toggleAutoScroll = () => {
  autoScroll();  // Re-apply scroll logic based on the new state of autoScrollEnabled
};

// Watch for changes to auto-scroll toggle
watch(autoScrollEnabled, (newVal) => {
  autoScroll();  // Apply the changes immediately
});
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>

<style scoped>
/* Target the internal input field */
::v-deep(.v-field__input) {
  font-size: v-bind(fontSize + 'px') !important;
}
</style>
