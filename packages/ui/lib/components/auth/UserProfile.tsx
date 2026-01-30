import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Separator } from '../ui/separator';

interface User {
  name: string;
  email: string;
  photo?: {
    completedUrl: string;
  };
  status: 'active' | 'inactive' | 'blocked';
}

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  wordCount?: number;
  onSettings?: () => void;
}

export const UserProfile = ({ user, onLogout, wordCount = 0, onSettings }: UserProfileProps) => {
  const fullName = user.name || 'User';
  // Generate initials from name (e.g., "Khanh Nguyen" -> "KN")
  const initials =
    fullName
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';

  return (
    <Card className="mx-auto w-full max-w-sm border-0 shadow-none">
      <CardHeader className="flex flex-col items-center gap-4 pb-2">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm">
          {user.photo?.completedUrl ? (
            <img src={user.photo.completedUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-100 text-2xl font-bold text-blue-600">
              {initials}
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'} className="px-4 py-1">
          {user.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />

        <div className="grid grid-cols-1 gap-4 text-center">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-lg font-bold text-blue-600">{wordCount}</div>
            <div className="text-xs text-gray-500">Words Saved</div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {onSettings && (
            <Button variant="outline" className="w-full justify-start text-left font-normal" onClick={onSettings}>
              Account Settings
            </Button>
          )}
        </div>

        <Button variant="destructive" className="w-full" onClick={onLogout}>
          Log out
        </Button>
      </CardContent>
    </Card>
  );
};
