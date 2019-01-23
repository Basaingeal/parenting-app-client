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
          />
        </v-flex>
        <v-flex
          xs7
          md4
        >
          <v-menu
            v-model="dobMenu"
            :close-on-content-click="false"
            full-width
            max-width="290px"
          >
            <v-text-field
              slot="activator"
              :value="readableDoB"
              label="Date of Birth"
              readonly
              required
              :rules="requiredRule('Date of Birth')"
            />
            <v-date-picker
              v-model="dateOfBirth"
              :allowed-dates="allowedDoB"
              @change="dobMenu = false"
            />
          </v-menu>
        </v-flex>

        <v-flex
          xs5
          md2
        >
          <v-menu
            v-model="tobMenu"
            :close-on-content-click="false"
            full-width
            max-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="timeOfBirth"
              label="Time of Birth"
              readonly
            />
            <v-time-picker
              v-model="timeOfBirth"
              @change="tobMenu = false"
            />
          </v-menu>
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
          />
        </v-flex>
        <v-flex
          xs12
          md2
        >
          <v-btn
            color="primary"
            :disabled="!valid"
            block
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
import { isBefore, parse } from 'date-fns'
import CREATE_CHILD from '@/graphql/CreateChild.gql'

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
      dobMenu: false,
      timeOfBirth: '',
      tobMenu: false,
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
      const firstName = this.firstName
      const lastName = this.lastName
      const gender = this.gender
      const dateOfBirthFull = `${this.dateOfBirth}T${this.timeOfBirth}`
      return {
        firstName,
        lastName,
        dateOfBirth: format(parse(dateOfBirthFull)),
        gender
      }
    },
    readableDoB () {
      return this.dateOfBirth ? format(this.dateOfBirth, 'MMMM Do YYYY') : ''
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
    requiredRule: (fieldName) => [
      v => !!v || `${fieldName} is required`
    ],
    allowedDoB: (value) => isBefore(parse(value), new Date()),
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
        }
      })
      const newChild = response.data.createChild

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

      this.$store.dispatch('addChild', newChild)
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
