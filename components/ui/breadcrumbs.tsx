import React from 'react';
import tw from 'tailwind-styled-components';
import { ChevronRightIcon } from 'lucide-react';

const BreadcrumbItem = tw('a')`
  text-gray-500
  hover:text-gray-700
  transition-colors
`;

const Separator = tw(ChevronRightIcon)`
  text-gray-300
  mx-2
`;

export type TBreadcrumbsProps = {
  paths: { label: string; href?: string; onClick?: () => void; }[];
}
const Breadcrumbs = ({ paths }: TBreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb">
      <div aria-labelledby="breadcrumb" className='flex flex-row'>
        {paths.map((path, index) => (
          <React.Fragment key={path.label}>
            <div>
              <BreadcrumbItem
                href={path.href ? path.href : "#"}
                {...path.onClick ? {} : { as: "button", onClick: path.onClick }}
              >
                {path.label}
              </BreadcrumbItem>
            </div>
            {index < paths.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
