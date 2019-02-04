<template>
  <v-form v-model="valid">
    <v-container>
      <v-layout
        row
        wrap
      >
        <input
          v-show="false"
          ref="babyImageInput"
          type="file"
          accept="image/*"
          @change="imagePicked"
        >
        <v-flex xs12>
          <v-hover style="cursor: pointer">
            <v-avatar
              slot-scope="{ hover }"
              size="144"
              color="white"
              @click="openFileInput"
            >
              <v-img
                :src="babyImgSource"
                height="144"
                width="144"
                contain
              >
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex accent darken-2 white--text v-card--reveal caption"
                    style="height:33%"
                  >
                    {{ addImageText }}
                  </div>
                </v-expand-transition>
              </v-img>
            </v-avatar>
          </v-hover>
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-text-field
            v-model="firstName"
            :rules="firstNameRules"
            label="First Name"
            required
            hint="Required"
            outline
          />
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-text-field
            v-model="lastName"
            :rules="nameRules"
            label="Last Name (optional)"
            outline
          />
        </v-flex>
        <v-flex
          xs12
          md4
        >
          <v-dialog
            ref="dobDialog"
            v-model="dobModal"
            :return-value.sync="dateOfBirth"
            persistent
            lazy
            full-width
            max-width="290px"
          >
            <v-text-field
              slot="activator"
              :value="readableDoB"
              label="Date of Birth"
              readonly
              required
              outline
              prepend-inner-icon="far fa-calendar"
              :rules="requiredRule('Date of Birth')"
            />
            <v-date-picker
              v-model="dateOfBirth"
              :allowed-dates="allowedDoB"
            >
              <v-spacer />
              <v-btn
                flat
                color="primary"
                @click="dobModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                flat
                color="primary"
                @click="$refs.dobDialog.save(dateOfBirth)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>

        <v-flex
          xs12
          md2
        >
          <v-dialog
            ref="tobDialog"
            v-model="tobModal"
            full-width
            lazy
            persistent
            max-width="290px"
          >
            <v-text-field
              slot="activator"
              :value="readableToB"
              label="Time of Birth"
              readonly
              outline
              prepend-inner-icon="far fa-clock"
            />
            <v-time-picker
              v-model="timeOfBirth"
            >
              <v-spacer />
              <v-btn
                flat
                color="primary"
                @click="tobModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                flat
                color="primary"
                @click="$refs.tobDialog.save(timeOfBirth)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-select
            v-model="gender"
            :items="genders"
            :rules="requiredRule('Gender')"
            label="Gender"
            outline
          />
        </v-flex>
        <v-flex
          xs12
        >
          <v-btn
            color="primary"
            :disabled="!valid"
            :block="!$vuetify.breakpoint.mdAndUp"
            @click="submitForm"
          >
            Add Child
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import format from 'date-fns/format'
import { isBefore, parseISO, getYear } from 'date-fns'
import CREATE_CHILD from '@/graphql/CreateChild.gql'
import GET_CHILDREN from '@/graphql/GetChildren.gql'
import { mapActions } from 'vuex'

export default {
  name: 'AddChildForm',
  data () {
    return {
      firstName: '',
      lastName: '',
      nameRules: [
        v => v.length > 2 || v.length === 0 || 'Name must be more than 2 characters long'
      ],
      dateOfBirth: '',
      dobModal: false,
      timeOfBirth: '',
      tobModal: false,
      valid: false,
      gender: '',
      genders: [
        {
          text: 'Male',
          value: 'MALE'
        },
        {
          text: 'Female',
          value: 'FEMALE'
        }
      ],
      babyImgSource: require('@/assets/baby-solid.svg'),
      imageAdded: false
    }
  },
  computed: {
    childInputModel  () {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.fullDateOfBirth,
        gender: this.gender,
        imageAdded: this.imageAdded
      }
    },
    readableDoB () {
      const dobYear = getYear(parseISO(this.dateOfBirth))
      const currentYear = getYear(new Date())
      let formatString = 'MMMM d'
      if (dobYear !== currentYear) {
        formatString += ' yyyy'
      }
      return this.dateOfBirth ? format(parseISO(this.dateOfBirth), formatString) : ''
    },
    readableToB () {
      return this.timeOfBirth ? format(parseISO(this.fullDateOfBirth), 'h:mm aa') : ''
    },
    fullDateOfBirth () {
      const dateToUse = this.dateOfBirth || format(new Date(), 'yyyy-MM-dd')
      return format((parseISO(`${dateToUse}T${this.timeOfBirth}`)), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    },
    firstNameRules () {
      return [
        ...this.nameRules,
        ...this.requiredRule('First Name')
      ]
    },
    addImageText () {
      return this.imageAdded ? 'Change Image' : 'Add Image'
    }
  },
  watch: {
    gender () {
      this.$emit('genderChanged', this.gender)
    }
  },
  methods: {
    ...mapActions(['setCurrentChild']),
    requiredRule: (fieldName) => [
      v => !!v || `${fieldName} is required`
    ],
    allowedDoB: (value) => isBefore(parseISO(value), new Date()),
    async submitForm () {
      if (this.valid) {
        const newChild = await this.saveChild()
        this.$emit('childAdded', newChild)
      }
    },
    async saveChild () {
      const response = await this.$apollo.mutate({
        mutation: CREATE_CHILD,
        variables: {
          child: this.childInputModel
        },
        update (cache, { data: { createChild } }) {
          const { children } = cache.readQuery({ query: GET_CHILDREN })
          cache.writeQuery({
            query: GET_CHILDREN,
            data: { children: [...children, createChild] }
          })
        }
      })
      const newChild = response.data.createChild
      this.setCurrentChild(newChild.id)
      // if an image was added, upload it using the new id.
      if (this.imageAdded) {
        const formData = new FormData()
        formData.append('file', this.$refs.babyImageInput.files[0])
        await this.$axios.post(`childImage/${newChild.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      return newChild
    },
    openFileInput () {
      this.$refs.babyImageInput.click()
    },
    imagePicked (e) {
      const file = e.target.files[0]
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.babyImgSource = fileReader.result
      }
      fileReader.readAsDataURL(file)
      this.imageAdded = true
    }
  }
}
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .75;
  position: absolute;
  width: 100%;
}
</style>
