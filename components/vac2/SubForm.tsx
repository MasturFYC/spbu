import React, { FormEvent, useState } from 'react'
import { iVaccin } from '@components/interfaces'
import moment from 'moment'
import { initDetail } from '@components/journal/orders'

export const initialVaccin: iVaccin = {
  vac2Id: 0,
  id: 0,
  createdAt: '',
  vacType: '',
  batch: '',
  vacLocation: '',
  description: '',
  isNew: true,
  isChanged: false,
  isSelected: false,
}

export default function SubForm({
  item,
  submitData,
  setOpen,
}: {
  item: iVaccin
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitData: (method: string, e: iVaccin) => void
}) {
  const [data, setData] = useState<iVaccin>(initialVaccin)
  const [submitOption, setSubmitOption] = React.useState('cancel')

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setData(item)
    }
    return () => {
      isLoaded = false
    }
  }, [item])

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
      <div className="flex flex-col border p-4 -mx-4">
        <div className={`flex flex-row ${item.isNew && 'mt-8'} gap-2`}>
          <div className="flex-1 flex-row">
            <div className="flex flex-row">On Date</div>
            <div className="flex flex-row gap-x-2">
              <input
                autoFocus
                className="w-full md:w-1/2 border border-1 px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                value={data.createdAt}
                onChange={(e) => handleChange('createdAt', e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <div>Fucksin Type</div>
            <select
              placeholder="e.g Moderna"
              className="rounded form-select border border-1 border-gray-400 px-2 py-0.5 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              onChange={(e) => handleChange('vacType', e.target.value)}
              value={data.vacType}
            >
              <option value="Astra Zeneca">Astra Zeneca</option>
              <option value="Pfizer">Pfizer</option>
              <option value="CoronaVac">CoronaVac</option>
              <option value="Moderna">Moderna</option>
              <option value="Sinovac">Sinovac</option>
            </select>
          </div>
        </div>

        <div className="flex flex-row mt-4 gap-2">
          <div className="flex-1">
            <div>Batch</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              value={data.batch}
              onChange={(e) => handleChange('batch', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <div>Location</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              value={data.vacLocation}
              onChange={(e) => handleChange('vacLocation', e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row mt-4 gap-2">
          <div className="flex-1">
            <div>Description</div>
            <input
              className="border border-1 px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-x-2 mt-4">
          <button
            onClick={(e) => setSubmitOption('delete')}
            type="submit"
            className={`inline-block w-24 text-center border-2 rounded-full py-1 px-4 font-medium 
            ${
              data.id === 0
                ? 'disabled:opacity-50 disabled:text-gray-500 disabled:border-gray-400 border border-gray-600'
                : 'border-red-600 text-red-600 hover:text-red-100 hover:bg-red-500 hover:border-red-500 active:text-red-400 active:bg-red-700 active:border-red-700'
            }
              `}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`inline-block w-24 text-center border-2 rounded-full py-1 px-4 font-medium
              border-gray-600 text-gray-600
              hover:text-gray-100 hover:bg-gray-500 hover:border-gray-500
              active:text-gray-400 active:bg-gray-700 active:border-gray-700`}
          >
            Cancel
          </button>
          <button
            onClick={() => setSubmitOption(data.isNew ? 'post' : 'put')}
            type="submit"
            className={`inline-block w-24 items-center justify-center gap-x-2 flex flex-row text-center border-2 rounded-full py-1 px-0 font-medium
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
              />
            </svg>
            Save
          </button>
        </div>
      </div>
    </form>
  )
}
