import { Input } from '../components/ui/input';

export default {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    type: {
      control: 'text',
    },
  },
};

export const Default = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email">Email</label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const Disabled = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const File = {
  args: {
    type: 'file',
  },
};
