import moment from 'moment'
import { setHttpAgentOptions } from 'next/dist/server/config'
import React, { FormEvent } from 'react'
import { iVac1 } from '../interfaces'

type vac1FormParam = {
  data: iVac1
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitData: (method: string, p: iVac1) => void
}

export const initData: iVac1 = {
  id: 0,
  uuid: '',
  name: '',
  nik: '',
  birthDate: moment(new Date()).format('YYYY-MM-DD'),
  firstDate: moment(new Date()).format('YYYY-MM-DD'),
  nextDate: moment(new Date()).format('YYYY-MM-DD'),
  vacType: 'CoronaVac',
  firstBatch: '',
  nextBatch: '',
  firstQr: '',
  nextQr: '',
  isSelected: true,
}

export default function Vac1Form({
  data: people,
  submitData,
  setOpen,
}: vac1FormParam): JSX.Element {
  const [data, setData] = React.useState<iVac1>(initData)
  const [oldId, setOldId] = React.useState<number>()
  const [submitOption, setSubmitOption] = React.useState('cancel')

  const isNameValid = React.useMemo(() => data && data.name && data.name.length > 0, [data])
  const isCodeValid = React.useMemo(() => data && data.uuid && data.uuid?.length > 0, [data])
  const isTypeValid = React.useMemo(() => data && data.vacType.length > 0, [data])
  const isBatchValid = React.useMemo(() => data && data.firstBatch.length > 0, [data])
  const isNextBatchValid = React.useMemo(() => data && data.nextBatch.length > 0, [data])
  const isNikValid = React.useMemo(() => data && data.nik.length > 0, [data])
  const isFirstQrValid = React.useMemo(() => data && data.nik.length > 0, [data])
  const isNextQrValid = React.useMemo(() => data && data.nik.length > 0, [data])

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setData({ ...people })
      setOldId(people.id)
    }

    return () => {
      isLoaded = true
    }
  }, [people])

  const handleChange = (name: string, value: string) => {
    const test = { ...data, [name]: value }
    setData((o) => ({ ...o, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitData(submitOption, data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-4 my-8">
        <div className="flex flex-col md:flex-row lg:flex-row gap-4">
          <div className="flex-1">
            <div>Name</div>
            <input
              autoFocus
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="e.g Doni Aramadi"
              onChange={(e) => handleChange('name', e.target.value)}
              value={data.name}
            />
          </div>
          <div className="flex-1">
            <div>UUID</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="e.g f5s65jh6rt9x8ff93y57dd"
              onChange={(e) => handleChange('uuid', e.target.value)}
              value={data.uuid}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4">
          <div className="flex-1">
            <div>NIK</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g 1234547987985465"
              type="text"
              onChange={(e) => handleChange('nik', e.target.value)}
              value={data.nik}
            />
          </div>
          <div className="flex-1">
            <div>Birth Date</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="date"
              onChange={(e) => handleChange('birthDate', e.target.value)}
              value={moment(data.birthDate).format('YYYY-MM-DD')}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4">
          <div className="flex-1">
            <div>First Date Fucksin</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="date"
              onChange={(e) => handleChange('firstDate', e.target.value)}
              value={moment(data.firstDate).format('YYYY-MM-DD')}
            />
          </div>
          <div className="flex-1">
            <div>Fucksin Type</div>
            <select
              placeholder="e.g Moderna"
              className="rounded form-select border border-1 border-gray-400 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              onChange={(e) => handleChange('vacType', e.target.value)}
              value={data.vacType}
            >
              <option value="Astra Zeneca">Astra Zeneca</option>
              <option value="Pfizer">Pfizer</option>
              <option value="Astra Zeneca">Astra Zeneca</option>
              <option value="Moderna">Moderna</option>
              <option value="Sinovac">Sinovac</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4">
          <div className="flex-1">
            <div>First Fucksin Batch</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="e.g 123656487"
              onChange={(e) => handleChange('firstBatch', e.target.value)}
              value={data.firstBatch}
            />
          </div>
          <div className="flex-1">
            <div>First QR</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="e.g Q-125TY15FF"
              onChange={(e) => handleChange('firstQr', e.target.value.toUpperCase())}
              value={data.firstQr}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4">
          <div className="flex-1">
            <div>Next Date</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="date"
              onChange={(e) => handleChange('nextDate', e.target.value)}
              value={moment(data.nextDate).format('YYYY-MM-DD')}
            />
          </div>
          <div className="flex-1">
            <div>Next Batch</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="e.g 32654974"
              onChange={(e) => handleChange('nextBatch', e.target.value)}
              value={data.nextBatch}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4">
          <div className="flex-1">
            <div>Next QR</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              placeholder="e.g P-125TY15FF"
              onChange={(e) => handleChange('nextQr', e.target.value.toUpperCase())}
              value={data.nextQr}
            />
          </div>
        </div>
        <div className="flex gap-x-2 mt-4">
          <button
            onClick={() => setSubmitOption('delete')}
            type="submit"
            disabled={oldId ? false : true}
            className={`select-none inline-block w-28 text-center border-2 rounded-full py-2 px-8 font-medium 
            ${
              oldId === 0
                ? 'disabled:opacity-50 disabled:text-gray-500 disabled:border-gray-400 border border-gray-600'
                : 'border-red-600 text-red-600 hover:text-red-100 hover:bg-red-500 hover:border-red-500 active:text-red-400 active:bg-red-700 active:border-red-700'
            }
              `}

            // className={` inline-block text-center ${oldId && 'text-red-500'
            //   } ${oldId && 'hover:text-red-900'} border ${oldId ? 'border-red-600' : 'border-gray-600'
            //   } border border-transparent rounded-md py-2 px-8 font-medium ${oldId && 'hover:border-red-700'
            //   }`}
          >
            Delete
          </button>
          <button
            type="button"
            className={`select-none inline-block w-28 text-center border-2 rounded-full py-2
              px-8 font-medium border-gray-600 text-gray-600
              hover:text-gray-100 hover:bg-gray-500 hover:border-gray-500
              active:text-gray-400 active:bg-gray-700 active:border-gray-700`}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            onClick={() => setSubmitOption(oldId ? 'put' : 'post')}
            type="submit"
            className={`select-none inline-block w-28 items-center justify-center gap-x-2 flex
              flex-row text-center border-2 rounded-full py-2 px-0 font-medium
              border-green-600 bg-green-600 text-white
              hover:text-green-50 hover:bg-green-500 hover:border-green-500
              active:text-green-400 active:bg-green-700 active:border-green-700`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 22.8 24"
              stroke="none"
            >
              <path
                fill="currentColor"
                d="M22.3,0h-3.8H4.3H0.4C0.2,0,0,0.2,0,0.4v19.2c0,0.1,0,0.2,0.1,0.3l3.9,3.9C4.1,24,4.3,24,4.4,24h1.2h12h4.8
		c0.2,0,0.4-0.2,0.4-0.4V0.4C22.8,0.2,22.6,0,22.3,0z M18.1,0.9v9.6H4.8V0.9H18.1z M6,23.1v-7.3h11.1v7.3H6z M21.9,23.1H18v-7.8
		c0-0.2-0.2-0.4-0.4-0.4h-12c-0.2,0-0.4,0.2-0.4,0.4v7.8H4.6l-3.7-3.7V0.9h3v10.1c0,0.2,0.2,0.4,0.4,0.4h14.3c0.2,0,0.4-0.2,0.4-0.4
		V0.9h2.9V23.1z"
              />
              <path
                fill="currentColor"
                d="M11.5,16.4H9.3c-0.2,0-0.4,0.2-0.4,0.4v5.3c0,0.2,0.2,0.4,0.4,0.4h2.2c0.2,0,0.4-0.2,0.4-0.4v-5.3
		C11.9,16.6,11.7,16.4,11.5,16.4z M11,21.7H9.7v-4.4H11V21.7z"
              />{' '}
            </svg>
            Save
          </button>
        </div>
      </div>
    </form>
  )
}
