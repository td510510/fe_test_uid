import React from 'react';

interface WithLoadingProps {
  isLoading: boolean;
}

const withLoadingIndicator = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return class extends React.Component<P & WithLoadingProps> {
    render() {
      const { isLoading, ...props } = this.props;
      if (isLoading) {
        return <div>Loading...</div>;
      }
      return <WrappedComponent {...props as P} />;
    }
  };
};

export default withLoadingIndicator;