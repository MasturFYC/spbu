import {
  ProgressCircle,
} from '@adobe/react-spectrum'

export default function WaitMe (): JSX.Element {
  return <div className="w-full flex h-full justifiy-content-center justify-center items-center">
    <ProgressCircle aria-label="Loading…" isIndeterminate />
  </div>
}